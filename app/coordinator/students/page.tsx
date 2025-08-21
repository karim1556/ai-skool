"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"

export default function CoordinatorStudentsPage() {
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const cu = await getCurrentUser()
        const email = (cu?.profile as any)?.email || cu?.user?.email
        if (!email) throw new Error("Not logged in")

        const coordRes = await fetch("/api/coordinators", { cache: "no-store" })
        if (!coordRes.ok) throw new Error("Failed to load coordinators")
        const coordinators = (await coordRes.json()) as any[]
        const me = coordinators.find((c) => (c?.email || "").toLowerCase() === String(email).toLowerCase())
        if (!me?.school_id) throw new Error("Coordinator record not found or no school assigned")
        if (!active) return
        setSchoolId(me.school_id)

        const res = await fetch(`/api/students?schoolId=${encodeURIComponent(me.school_id)}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load students")
        const data = await res.json()
        if (!active) return
        setStudents(Array.isArray(data) ? data : [])
      } catch (e: any) {
        if (!active) return
        setError(e?.message || "Failed to load students")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Students" Sidebar={CoordinatorSidebar}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Students</h1>
        <div className="flex gap-2">
          <Link href="/coordinator/students/new"><Button>Add Student</Button></Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your School Students</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : error ? error : schoolId ? `School ID: ${schoolId}` : "No school linked"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && !error && (
            <div className="divide-y rounded-md border">
              {students.length === 0 && (
                <div className="p-3 text-sm text-muted-foreground">No students found</div>
              )}
              {students.map((s) => (
                <div key={s.id} className="p-3 text-sm">
                  <div className="font-medium">{`${s.first_name || ""} ${s.last_name || ""}`.trim() || s.email || s.id}</div>
                  <div className="text-xs text-muted-foreground">{s.email || ""}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

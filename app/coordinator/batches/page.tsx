"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { Protect } from "@clerk/nextjs"

export default function CoordinatorBatchesPage() {
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [batches, setBatches] = useState<any[]>([])
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

        const res = await fetch(`/api/batches?schoolId=${encodeURIComponent(me.school_id)}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load batches")
        const data = await res.json()
        if (!active) return
        setBatches(Array.isArray(data) ? data : [])
      } catch (e: any) {
        if (!active) return
        setError(e?.message || "Failed to load batches")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <Protect
    role="schoolcoordinator"
    fallback={<p>Access denied</p>}
    >
    <RoleLayout title="Aiskool LMS" subtitle="Batches" Sidebar={CoordinatorSidebar}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Batches</h1>
        <div className="flex gap-2">
          <Link href="/coordinator/batches/new"><Button>Create Batch</Button></Link>
          <Link href="/coordinator/assign-trainer"><Button variant="secondary">Assign Trainer</Button></Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your School Batches</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : error ? error : schoolId ? `School ID: ${schoolId}` : "No school linked"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && !error && (
            <div className="divide-y rounded-md border">
              {batches.length === 0 && (
                <div className="p-3 text-sm text-muted-foreground">No batches found</div>
              )}
              {batches.map((b) => (
                <div key={b.id} className="p-3 text-sm flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">Students: {b.student_count || 0} • Trainers: {b.trainer_count || 0}</div>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">{b.status || "pending"}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
    </Protect>
  )
}

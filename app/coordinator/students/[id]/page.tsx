"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CoordinatorStudentViewPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id as string
  const [student, setStudent] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/students?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load student')
        const data = await res.json()
        if (!active) return
        setStudent(Array.isArray(data) ? data[0] : data)
      } catch (e: any) {
        if (!active) return
        setError(e?.message || 'Failed to load student')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [id])

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Students" Sidebar={CoordinatorSidebar}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Student Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
          {id && <Link href={`/coordinator/students/${id}/edit`}><Button>Edit</Button></Link>}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{student ? (`${student.first_name || ''} ${student.last_name || ''}`.trim() || student.email || 'Student') : 'Student'}</CardTitle>
          <CardDescription>{loading ? 'Loading...' : error ? error : student?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && !error && student && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">First name:</span> {student.first_name || '—'}</div>
              <div><span className="text-muted-foreground">Last name:</span> {student.last_name || '—'}</div>
              <div><span className="text-muted-foreground">Email:</span> {student.email || '—'}</div>
              <div><span className="text-muted-foreground">Phone:</span> {student.phone ? String(student.phone) : '—'}</div>
              <div><span className="text-muted-foreground">Parent phone:</span> {student.parent_phone ? String(student.parent_phone) : '—'}</div>
              <div className="md:col-span-2"><span className="text-muted-foreground">Address:</span> {student.address || '—'}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

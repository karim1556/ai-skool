"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { RoleLayout } from "@/components/layout/role-layout"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StudentCoursesPage() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [coordBySchool, setCoordBySchool] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return
    let active = true
    ;(async () => {
      setLoading(true); setError(null)
      try {
        await fetch('/api/sync/me', { method: 'POST' })
        const res = await fetch(`/api/batch-enrolments?studentClerkId=${userId}`)
        const js = await res.json()
        if (!res.ok) throw new Error(js?.error || 'Failed to load enrollments')
        if (!active) return
        const arr = Array.isArray(js) ? js : []
        setEnrollments(arr)
        const schoolIds = Array.from(new Set(arr.map((e:any)=>e.school_id).filter(Boolean)))
        const coordEntries = await Promise.all(schoolIds.map(async (sid:string)=>{
          const r = await fetch(`/api/coordinators?schoolId=${sid}`)
          const list = await r.json()
          return [sid, (Array.isArray(list) ? list[0] : null)] as const
        }))
        const cmap: Record<string, any> = {}
        for (const [sid, c] of coordEntries) { if (sid && c) cmap[sid] = c }
        setCoordBySchool(cmap)
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [isLoaded, isSignedIn, userId])

  return (
    <RoleLayout title="Aiskool LMS" subtitle="My Courses" Sidebar={StudentSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>Courses you are currently enrolled in</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-destructive">{error}</div>
          ) : enrollments.length === 0 ? (
            <div className="text-sm text-muted-foreground">You are not enrolled in any courses yet.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {enrollments.map((enr:any) => (
                <Card key={enr.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{enr.batch_name || 'Batch'}</CardTitle>
                    <CardDescription>Batch ID: {enr.batch_id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start justify-between gap-4">
                      <Badge variant="secondary">Enrolled</Badge>
                      {enr.school_id && coordBySchool[enr.school_id] && (
                        <div className="text-xs text-muted-foreground text-right">
                          <div className="font-medium text-foreground">Coordinator</div>
                          <div>{coordBySchool[enr.school_id].first_name || ''} {coordBySchool[enr.school_id].last_name || ''}</div>
                          {coordBySchool[enr.school_id].email && <div>{coordBySchool[enr.school_id].email}</div>}
                          {coordBySchool[enr.school_id].phone && <div>{coordBySchool[enr.school_id].phone}</div>}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { RoleLayout } from "@/components/layout/role-layout"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Simple date formatter
function fmt(d?: string | null) {
  if (!d) return ""
  const dt = new Date(d)
  if (isNaN(+dt)) return String(d)
  return dt.toLocaleDateString()
}

export default function StudentAssignmentsPage() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [assignmentsByBatch, setAssignmentsByBatch] = useState<Record<string, any[]>>({})
  const [submissions, setSubmissions] = useState<any[]>([])

  const studentInternalId = useMemo(() => {
    return enrollments?.[0]?.student_id as string | undefined
  }, [enrollments])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return
    let active = true
    ;(async () => {
      setLoading(true); setError(null)
      try {
        await fetch('/api/sync/me', { method: 'POST' })
        // 1) fetch enrollments by clerk id
        const enrRes = await fetch(`/api/batch-enrolments?studentClerkId=${userId}`)
        const enr = await enrRes.json()
        if (!enrRes.ok) throw new Error(enr?.error || 'Failed to load enrollments')
        if (!active) return
        const enrArr = Array.isArray(enr) ? enr : []
        setEnrollments(enrArr)

        // 2) fetch assignments for each enrolled batch
        const byBatch: Record<string, any[]> = {}
        for (const e of enrArr) {
          const r = await fetch(`/api/assignments?batchId=${e.batch_id}`)
          const list = await r.json()
          byBatch[e.batch_id] = Array.isArray(list) ? list : []
        }
        if (!active) return
        setAssignmentsByBatch(byBatch)

        // 3) fetch my submissions (optionally per batch)
        if (enrArr.length && enrArr[0]?.student_id) {
          const sid = enrArr[0].student_id
          // we can fetch all submissions for this student; API requires school scope already
          const subRes = await fetch(`/api/submissions?studentId=${sid}`)
          const subJs = await subRes.json()
          if (!subRes.ok) throw new Error(subJs?.error || 'Failed to load submissions')
          if (!active) return
          setSubmissions(Array.isArray(subJs) ? subJs : [])
        } else {
          setSubmissions([])
        }
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [isLoaded, isSignedIn, userId])

  // map submissions by assignment_id for quick lookup
  const subByAssignment = useMemo(() => {
    const m: Record<string, any> = {}
    for (const s of submissions) m[s.assignment_id] = s
    return m
  }, [submissions])

  const batchIds = useMemo(() => Array.from(new Set(enrollments.map(e=>e.batch_id))), [enrollments])

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Assignments" Sidebar={StudentSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>My Assignments</CardTitle>
          <CardDescription>Assignments across your enrolled batches</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-destructive">{error}</div>
          ) : batchIds.length === 0 ? (
            <div className="text-sm text-muted-foreground">No enrollments found.</div>
          ) : (
            <div className="space-y-6">
              {batchIds.map((bid) => {
                const batchAssignments = assignmentsByBatch[bid] || []
                const enr = enrollments.find(e=>e.batch_id===bid)
                return (
                  <Card key={bid}>
                    <CardHeader>
                      <CardTitle className="text-base">{enr?.batch_name || 'Batch'} – Assignments</CardTitle>
                      <CardDescription>Batch ID: {bid}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {batchAssignments.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No assignments yet.</div>
                      ) : (
                        <div className="space-y-3">
                          {batchAssignments.map((a:any) => {
                            const sub = subByAssignment[a.id]
                            return (
                              <div key={a.id} className="flex items-start justify-between gap-4 border rounded-md p-3">
                                <div>
                                  <div className="font-medium">{a.title || 'Untitled assignment'}</div>
                                  {a.due_date && (
                                    <div className="text-xs text-muted-foreground">Due: {fmt(a.due_date)}</div>
                                  )}
                                </div>
                                <div className="text-right space-y-1">
                                  {!sub ? (
                                    <Badge variant="secondary">Not submitted</Badge>
                                  ) : (
                                    <>
                                      <Badge variant="secondary">Submitted {fmt(sub.submitted_at)}</Badge>
                                      {sub.grade !== null && sub.grade !== undefined && (
                                        <div className="text-xs">Grade: {sub.grade}</div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

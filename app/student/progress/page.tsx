"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { RoleLayout } from "@/components/layout/role-layout"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudentProgressPage() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [assignmentsByBatch, setAssignmentsByBatch] = useState<Record<string, any[]>>({})
  const [submissions, setSubmissions] = useState<any[]>([])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return
    let active = true
    ;(async () => {
      setLoading(true); setError(null)
      try {
        await fetch('/api/sync/me', { method: 'POST' })
        const enrRes = await fetch(`/api/batch-enrolments?studentClerkId=${userId}`)
        const enrJs = await enrRes.json()
        if (!enrRes.ok) throw new Error(enrJs?.error || 'Failed to load enrollments')
        if (!active) return
        const enrArr = Array.isArray(enrJs) ? enrJs : []
        setEnrollments(enrArr)

        // Fetch assignments per batch
        const byBatch: Record<string, any[]> = {}
        for (const e of enrArr) {
          const r = await fetch(`/api/assignments?batchId=${e.batch_id}`)
          const list = await r.json()
          byBatch[e.batch_id] = Array.isArray(list) ? list : []
        }
        if (!active) return
        setAssignmentsByBatch(byBatch)

        // Fetch my submissions
        const sid = enrArr[0]?.student_id
        if (sid) {
          const sRes = await fetch(`/api/submissions?studentId=${sid}`)
          const sJs = await sRes.json()
          if (!sRes.ok) throw new Error(sJs?.error || 'Failed to load submissions')
          if (!active) return
          setSubmissions(Array.isArray(sJs) ? sJs : [])
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

  const stats = useMemo(() => {
    const allAssignments = Object.values(assignmentsByBatch).flat()
    const totalAssignments = allAssignments.length
    const submittedSet = new Set(submissions.map(s=>s.assignment_id))
    const submittedCount = submittedSet.size
    const graded = submissions.filter(s => s.grade !== null && s.grade !== undefined)
    const gradedCount = graded.length
    const avgGrade = gradedCount ? (graded.reduce((a,b)=>a + Number(b.grade || 0), 0) / gradedCount) : null
    return { totalAssignments, submittedCount, gradedCount, avgGrade }
  }, [assignmentsByBatch, submissions])

  const perBatch = useMemo(() => {
    return (enrollments || []).map(e => {
      const list = assignmentsByBatch[e.batch_id] || []
      const total = list.length
      const submitted = list.filter(a => submissions.some(s=>s.assignment_id === a.id)).length
      const gradedSubs = submissions.filter(s => list.some(a=>a.id===s.assignment_id) && s.grade !== null && s.grade !== undefined)
      const avg = gradedSubs.length ? (gradedSubs.reduce((acc, s)=>acc + Number(s.grade || 0), 0) / gradedSubs.length) : null
      return { batchId: e.batch_id, batchName: e.batch_name, total, submitted, avg }
    })
  }, [enrollments, assignmentsByBatch, submissions])

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Progress" Sidebar={StudentSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>Your assignment progress across all enrolled batches</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-destructive">{error}</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-md border"><div className="text-sm text-muted-foreground">Assignments</div><div className="text-2xl font-semibold">{stats.totalAssignments}</div></div>
                <div className="p-4 rounded-md border"><div className="text-sm text-muted-foreground">Submitted</div><div className="text-2xl font-semibold">{stats.submittedCount}</div></div>
                <div className="p-4 rounded-md border"><div className="text-sm text-muted-foreground">Graded</div><div className="text-2xl font-semibold">{stats.gradedCount}</div></div>
                <div className="p-4 rounded-md border"><div className="text-sm text-muted-foreground">Avg Grade</div><div className="text-2xl font-semibold">{stats.avgGrade !== null ? stats.avgGrade.toFixed(2) : '-'}</div></div>
              </div>

              <div className="space-y-4">
                {perBatch.map(b => (
                  <div key={b.batchId} className="border rounded-md p-4">
                    <div className="font-medium">{b.batchName || 'Batch'} (ID: {b.batchId})</div>
                    <div className="text-sm text-muted-foreground">Assignments: {b.total} • Submitted: {b.submitted} • Avg Grade: {b.avg !== null ? b.avg.toFixed(2) : '-'}</div>
                  </div>
                ))}
                {perBatch.length === 0 && (
                  <div className="text-sm text-muted-foreground">No enrollments found.</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

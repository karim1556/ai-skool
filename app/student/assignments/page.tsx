"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { RoleLayout } from "@/components/layout/role-layout"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [submittingId, setSubmittingId] = useState<string | null>(null)

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

  async function handleSubmitAssignment(a:any) {
    if (!studentInternalId) return
    const f = files[a.id]
    if (!f) { alert('Please choose a file before submitting.'); return }
    try {
      setSubmittingId(a.id)
      // 1) upload file
      const fd = new FormData()
      fd.append('file', f)
      const upRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const upJs = await upRes.json()
      if (!upRes.ok || !upJs?.url) throw new Error(upJs?.error || 'Upload failed')
      // 2) create submission
      const subRes = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignment_id: a.id, student_id: studentInternalId, content_url: upJs.url })
      })
      const subJs = await subRes.json()
      if (!subRes.ok) throw new Error(subJs?.error || 'Submission failed')
      // 3) refresh submissions list
      const sRes = await fetch(`/api/submissions?studentId=${studentInternalId}`)
      const sJs = await sRes.json()
      if (sRes.ok) setSubmissions(Array.isArray(sJs) ? sJs : [])
      // clear file for this assignment
      setFiles(prev => ({ ...prev, [a.id]: null }))
    } catch (e:any) {
      alert(e?.message || 'Failed to submit assignment')
    } finally {
      setSubmittingId(null)
    }
  }

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
                                <div className="space-y-1">
                                  <div className="font-medium">{a.title || 'Untitled assignment'}</div>
                                  {a.description && <div className="text-sm text-muted-foreground line-clamp-2">{a.description}</div>}
                                  <div className="text-xs text-muted-foreground flex gap-2">
                                    {a.due_date && <span>Due: {fmt(a.due_date)}</span>}
                                    <span>Batch: {bid}</span>
                                  </div>
                                </div>
                                <div className="text-right space-y-2 min-w-[260px]">
                                  {!sub ? (
                                    <>
                                      <div className="text-xs text-muted-foreground">Attach your file (PDF/Doc/Zip)</div>
                                      <Input type="file" onChange={(e)=>setFiles(prev => ({ ...prev, [a.id]: e.target.files?.[0] || null }))} />
                                      <Button size="sm" onClick={()=>handleSubmitAssignment(a)} disabled={!files[a.id] || submittingId===a.id}>{submittingId===a.id ? 'Submitting...' : 'Submit'}</Button>
                                    </>
                                  ) : (
                                    <>
                                      <Badge variant="secondary">Submitted {fmt(sub.submitted_at)}</Badge>
                                      <div>
                                        <a className="text-xs text-primary" href={sub.content_url || '#'} target="_blank" rel="noreferrer">View submission</a>
                                      </div>
                                      {sub.grade !== null && sub.grade !== undefined && (
                                        <div className="text-xs">Grade: {sub.grade}</div>
                                      )}
                                      {sub.feedback && <div className="text-xs text-muted-foreground">Feedback: {sub.feedback}</div>}
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

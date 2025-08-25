"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useAuth, useOrganization, useUser } from "@clerk/nextjs"

export default function StudentSubmissionsPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<Record<string, any>>({})
  const [openFor, setOpenFor] = useState<string | null>(null)
  const [contentUrl, setContentUrl] = useState("")
  const [saving, setSaving] = useState(false)

  const studentId = useMemo(() => {
    // Student ID is from our DB, not Clerk; we expect batch-enrolments API to be keyed by Clerk userId
    return user?.id || ''
  }, [user?.id])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!authLoaded || !orgLoaded || !userLoaded || !isSignedIn || !organization?.id) return
      setLoading(true); setError(null)
      try {
        // Ensure DB entities exist for this user/org
        await fetch('/api/sync/me', { method: 'POST' })
        const enrRes = await fetch(`/api/batch-enrolments?studentId=${studentId}`)
        const enrJs = await enrRes.json()
        if (!enrRes.ok) throw new Error(enrJs?.error || 'Failed to load enrollments')
        const batchIds: string[] = (enrJs || []).map((e:any) => e.batch_id)
        setEnrollments(enrJs || [])

        // Load assignments for these batches
        const lists = await Promise.all(batchIds.map(id => fetch(`/api/assignments?batchId=${id}`).then(r => r.json())))
        const ass = lists.flat()
        // Deduplicate by id in case of overlaps
        const byId: Record<string, any> = {}
        for (const a of ass) byId[a.id] = a
        const dedup = Object.values(byId)

        // Load my submissions for these assignments
        const mySubLists = await Promise.all(dedup.map(a => fetch(`/api/submissions?assignmentId=${a.id}&studentId=${studentId}`).then(r => r.json())))
        const subMap: Record<string, any> = {}
        mySubLists.forEach((arr:any[]) => {
          (arr || []).forEach((s:any) => { subMap[s.assignment_id] = s })
        })
        if (!active) return
        setAssignments(dedup)
        setSubmissions(subMap)
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load assignments')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, userLoaded, isSignedIn, organization?.id, studentId])

  const openSubmit = (assignment:any) => {
    setContentUrl(submissions[assignment.id]?.content_url || "")
    setOpenFor(assignment.id)
  }

  const submitWork = async () => {
    if (!openFor) return
    setSaving(true); setError(null)
    try {
      const existing = submissions[openFor]
      if (existing?.id) {
        // update
        const res = await fetch(`/api/submissions?id=${existing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content_url: contentUrl })
        })
        const js = await res.json()
        if (!res.ok) throw new Error(js?.error || 'Failed to update submission')
      } else {
        const res = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assignment_id: openFor, student_id: studentId, content_url: contentUrl })
        })
        const js = await res.json()
        if (!res.ok) throw new Error(js?.error || 'Failed to submit')
      }
      // Refresh single assignment submission
      const sres = await fetch(`/api/submissions?assignmentId=${openFor}&studentId=${studentId}`)
      const sjs = await sres.json()
      if (sres.ok) {
        const latest = (sjs || [])[0]
        setSubmissions(prev => ({ ...prev, [openFor]: latest }))
      }
      setOpenFor(null)
    } catch (e:any) {
      setError(e?.message || 'Failed to submit')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Assignments</h1>
        <p className="text-muted-foreground">Submit work and track grades</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>Assignments for your enrolled batches</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? 'Loading...' : error ? (
            <div className="text-destructive">{error}</div>
          ) : (
            <div className="space-y-3">
              {assignments.length === 0 && <div className="text-sm text-muted-foreground">No assignments.</div>}
              {assignments.map((a:any) => {
                const sub = submissions[a.id]
                return (
                  <div key={a.id} className="border rounded-md p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{a.title || 'Untitled'}</div>
                      <div className="text-sm text-muted-foreground">Due: {a.due_date || 'N/A'}</div>
                      {sub && (
                        <div className="text-xs mt-1">
                          Submitted: {new Date(sub.submitted_at).toLocaleString()}
                          {typeof sub.grade === 'number' && (
                            <span className="ml-2">Grade: {sub.grade} {sub.feedback ? `• ${sub.feedback}` : ''}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {sub ? (
                        <Button size="sm" variant="outline" onClick={() => openSubmit(a)}>Update</Button>
                      ) : (
                        <Button size="sm" onClick={() => openSubmit(a)}>Submit</Button>
                      )}
                      {sub?.content_url && (
                        <a className="text-sm text-primary" href={sub.content_url} target="_blank" rel="noreferrer">Open</a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!openFor} onOpenChange={(o)=>{ if(!o) setOpenFor(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>Provide a link to your work (e.g., Drive, GitHub, file URL)</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="https://..." value={contentUrl} onChange={(e)=>setContentUrl(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={submitWork} disabled={saving || !contentUrl.trim()}>{saving ? 'Saving...' : 'Save'}</Button>
              <Button variant="outline" onClick={()=>setOpenFor(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

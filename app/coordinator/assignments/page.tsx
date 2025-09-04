"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth, useOrganization } from "@clerk/nextjs"

export default function CoordinatorAssignmentsPage() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()

  // form state
  const [title, setTitle] = useState("")
  const [batchId, setBatchId] = useState("")
  const [trainerId, setTrainerId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [instructions, setInstructions] = useState("")

  // data state
  const [batches, setBatches] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const batchNameById = useMemo(() => Object.fromEntries((batches||[]).map((b:any)=>[b.id, b.name || b.title || 'Batch'])), [batches])
  const trainerNameById = useMemo(() => Object.fromEntries((trainers||[]).map((t:any)=>[t.id, `${t.first_name||''} ${t.last_name||''}`.trim() || t.email || 'Trainer'])), [trainers])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!authLoaded || !orgLoaded || !isSignedIn || !organization?.id) return
      setLoading(true)
      setError(null)
      try {
        try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }) } catch {}
        const schoolRes = await fetch('/api/me/school', { cache: 'no-store' })
        const school = schoolRes.ok ? await schoolRes.json() : null
        if (!school?.schoolId) throw new Error('No school bound to org')
        const [bRes, tRes, aRes] = await Promise.all([
          fetch(`/api/batches?schoolId=${school.schoolId}`, { cache: 'no-store' }),
          fetch(`/api/trainers?schoolId=${school.schoolId}`, { cache: 'no-store' }),
          fetch(`/api/assignments`, { cache: 'no-store' })
        ])
        const [bjs, tjs, ajs] = await Promise.all([bRes.json(), tRes.json(), aRes.json()])
        if (!bRes.ok) throw new Error(bjs?.error || 'Failed to load batches')
        if (!tRes.ok) throw new Error(tjs?.error || 'Failed to load trainers')
        if (!aRes.ok) throw new Error(ajs?.error || 'Failed to load assignments')
        if (!active) return
        setBatches(Array.isArray(bjs) ? bjs : [])
        setTrainers(Array.isArray(tjs) ? tjs : [])
        setAssignments(Array.isArray(ajs) ? ajs : [])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, isSignedIn, organization?.id])

  const onCreate = async () => {
    setPosting(true); setError(null)
    try {
      if (!batchId || !trainerId) throw new Error('Select batch and trainer')
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch_id: batchId, trainer_id: trainerId, title, instructions, due_date: dueDate || null })
      })
      const js = await res.json()
      if (!res.ok) throw new Error(js?.error || 'Failed to create assignment')
      // refresh list
      const listRes = await fetch('/api/assignments', { cache: 'no-store' })
      const list = await listRes.json()
      if (listRes.ok) setAssignments(Array.isArray(list) ? list : [])
      // reset some fields
      setTitle("")
      setDueDate("")
      setInstructions("")
    } catch (e:any) {
      setError(e?.message || 'Failed to create assignment')
    } finally { setPosting(false) }
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Assignments" Sidebar={CoordinatorSidebar}>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Assignment</CardTitle>
            <CardDescription>Only coordinators can create. Trainers will grade.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="text-sm text-destructive mb-2">{error}</div>}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g., Build a Todo App" />
              </div>
              <div className="grid gap-2">
                <Label>Batch</Label>
                <Select value={batchId} onValueChange={setBatchId}>
                  <SelectTrigger id="batch"><SelectValue placeholder={loading? 'Loading...' : 'Select batch'} /></SelectTrigger>
                  <SelectContent>
                    {(batches||[]).map((b:any)=> (
                      <SelectItem key={b.id} value={b.id}>{b.name || b.title || b.id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Trainer</Label>
                <Select value={trainerId} onValueChange={setTrainerId}>
                  <SelectTrigger id="trainer"><SelectValue placeholder={loading? 'Loading...' : 'Assign trainer'} /></SelectTrigger>
                  <SelectContent>
                    {(trainers||[]).map((t:any)=> (
                      <SelectItem key={t.id} value={t.id}>{`${t.first_name||''} ${t.last_name||''}`.trim() || t.email || t.id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due">Due Date</Label>
                <Input id="due" type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea id="instructions" value={instructions} onChange={(e)=>setInstructions(e.target.value)} placeholder="What should students do?" />
              </div>
              <div>
                <Button onClick={onCreate} disabled={posting || loading}>{posting ? 'Creating...' : 'Create Assignment'}</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Assignments</CardTitle>
            <CardDescription>Includes assignments previously created by trainers</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? 'Loading...' : (
              <div className="divide-y">
                {assignments.length === 0 && <div className="text-sm text-muted-foreground">No assignments yet.</div>}
                {assignments.map((a:any)=> (
                  <div key={a.id} className="py-3">
                    <div className="font-medium">{a.title || 'Untitled Assignment'}</div>
                    <div className="text-sm text-muted-foreground flex gap-3">
                      <span>Batch: {batchNameById[a.batch_id] || a.batch_id}</span>
                      <span>Trainer: {trainerNameById[a.trainer_id] || a.trainer_id}</span>
                      <span>Due: {a.due_date || '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}

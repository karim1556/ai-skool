"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth, useOrganization, useUser } from "@clerk/nextjs"

export default function NewAssignmentPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [batchId, setBatchId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [instructions, setInstructions] = useState("")

  const [batches, setBatches] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!authLoaded || !orgLoaded || !userLoaded || !isSignedIn || !organization?.id) return
      setError(null)
      try {
        await fetch('/api/sync/me', { method: 'POST' })
        const schoolRes = await fetch('/api/me/school'); const school = await schoolRes.json()
        if (!school?.id) throw new Error('No school context')
        const [bRes, tRes] = await Promise.all([
          fetch(`/api/batches?schoolId=${school.id}`),
          fetch(`/api/trainers?schoolId=${school.id}`)
        ])
        const [bjs, tjs] = await Promise.all([bRes.json(), tRes.json()])
        if (!active) return
        setBatches(bjs || [])
        setTrainers(tjs || [])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load form data')
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, userLoaded, isSignedIn, organization?.id])

  const myTrainer = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
    if (!email) return null
    return trainers.find((t:any) => (t.email || '').toLowerCase() === email) || null
  }, [trainers, user?.primaryEmailAddress?.emailAddress])

  // Wire to POST /api/assignments endpoint
  const onCreate = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!batchId || !myTrainer?.id) throw new Error('Select batch; trainer not identified')
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch_id: batchId,
          trainer_id: myTrainer.id,
          title,
          instructions,
          due_date: dueDate || null,
        })
      })
      const js = await res.json()
      if (!res.ok) throw new Error(js?.error || 'Failed to post assignment')
      alert('Assignment posted')
    } catch (e:any) {
      setError(e?.message || 'Failed to post assignment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Post Assignment" Sidebar={TrainerSidebar}>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Assignment</CardTitle>
          <CardDescription>
            {error ? <span className="text-destructive">{error}</span> : 'Create an assignment for a batch'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Build a Todo App" />
            </div>
            <div className="grid gap-2">
              <Label>Batch</Label>
              <Select value={batchId} onValueChange={setBatchId}>
                <SelectTrigger id="batch"><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>
                  {batches.filter((b:any) => String(b.trainer_ids || '').split(',').includes(myTrainer?.id || '')).map((b:any) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due">Due Date</Label>
              <Input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="What should students do?" />
            </div>
            <div>
              <Button onClick={onCreate} disabled={loading}>Post Assignment</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

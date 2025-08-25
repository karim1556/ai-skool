import { useAuth, useOrganization, useUser } from "@clerk/nextjs"
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

export default function NewSessionPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [batchId, setBatchId] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")

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

  // NOTE: This is a UI stub. Hook POST to your future /api/sessions endpoint
  const onCreate = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!batchId || !myTrainer?.id) throw new Error('Select batch; trainer not identified')
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch_id: batchId,
          trainer_id: myTrainer.id,
          title,
          notes,
          session_date: date || null,
          session_time: time || null,
        })
      })
      const js = await res.json()
      if (!res.ok) throw new Error(js?.error || 'Failed to create session')
      alert('Session created')
    } catch (e:any) {
      setError(e?.message || 'Failed to create session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Create Session" Sidebar={TrainerSidebar}>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Session</CardTitle>
          <CardDescription>
            {error ? <span className="text-destructive">{error}</span> : 'Schedule a session for one of your batches'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., React Props Deep Dive" />
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Agenda, materials link, etc." />
            </div>
            <div>
              <Button onClick={onCreate} disabled={loading}>Create Session</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

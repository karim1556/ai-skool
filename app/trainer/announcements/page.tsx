"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@clerk/nextjs"

export default function TrainerAnnouncementsPage() {
  const { user } = useUser()
  const [batches, setBatches] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string>("")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const myTrainer = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
    if (!email) return null
    return trainers.find((t:any) => (t.email || '').toLowerCase() === email) || null
  }, [trainers, user?.primaryEmailAddress?.emailAddress])

  const myBatches = useMemo(() => {
    if (!myTrainer) return []
    return (batches || []).filter((b:any) => (b.trainer_ids || '').split(',').map((x:string)=>x.trim()).includes(myTrainer.id))
  }, [batches, myTrainer])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [bRes, tRes] = await Promise.all([
          fetch('/api/batches'),
          fetch('/api/trainers')
        ])
        const [bjs, tjs] = await Promise.all([bRes.json(), tRes.json()])
        if (!active) return
        setBatches(bjs || [])
        setTrainers(tjs || [])
      } catch (e) {
        console.error('Failed to load context', e)
      }
    })()
    return () => { active = false }
  }, [])

  const submitAnnouncement = async () => {
    if (!selectedBatch || !myTrainer?.id) { setMessage('Please select a batch'); return }
    setSubmitting(true); setMessage(null)
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch_id: selectedBatch, trainer_id: myTrainer.id, title, body })
      })
      const js = await res.json()
      if (!res.ok) throw new Error(js?.error || 'Failed to post')
      setTitle(""); setBody("")
      setMessage('Announcement posted')
    } catch (e:any) {
      setMessage(e?.message || 'Failed to post announcement')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Announcements" Sidebar={TrainerSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
          <CardDescription>Send a message to a selected batch.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-xl">
            <div>
              <div className="mb-2 text-sm">Batch</div>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder={myBatches.length ? 'Select batch' : 'No batches assigned'} />
                </SelectTrigger>
                <SelectContent>
                  {myBatches.map((b:any) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="mb-2 text-sm">Title</div>
              <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Optional title" />
            </div>
            <div>
              <div className="mb-2 text-sm">Message</div>
              <Textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Write your announcement..." rows={6} />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={submitAnnouncement} disabled={submitting || !selectedBatch}>Post</Button>
              {message && <span className="text-sm text-muted-foreground">{message}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

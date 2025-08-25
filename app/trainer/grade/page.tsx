"use client"

import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useEffect, useMemo, useState } from "react"
import { useAuth, useOrganization, useUser } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

export default function GradeSubmissionsPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()
  const searchParams = useSearchParams()
  const assignmentId = searchParams.get('assignmentId')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])
  const [savingId, setSavingId] = useState<string | null>(null)

  const myTrainer = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
    if (!email) return null
    return trainers.find((t:any) => (t.email || '').toLowerCase() === email) || null
  }, [trainers, user?.primaryEmailAddress?.emailAddress])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!authLoaded || !orgLoaded || !userLoaded || !isSignedIn || !organization?.id) return
      setLoading(true); setError(null)
      try {
        await fetch('/api/sync/me', { method: 'POST' })
        const tRes = await fetch('/api/trainers')
        const tjs = await tRes.json()
        if (!tRes.ok) throw new Error(tjs?.error || 'Failed to load trainers')
        const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
        const me = (tjs || []).find((t:any) => (t.email || '').toLowerCase() === email)
        const url = assignmentId ? `/api/submissions?assignmentId=${assignmentId}&onlyUngraded=true` : `/api/submissions?trainerId=${me?.id || ''}&onlyUngraded=true`
        const res = await fetch(url)
        const js = await res.json()
        if (!res.ok) throw new Error(js?.error || 'Failed to fetch submissions')
        if (!active) return
        setTrainers(tjs || [])
        setSubmissions(js || [])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load submissions')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, userLoaded, isSignedIn, organization?.id, assignmentId])

  const grade = async (id:string, gradeVal:string, feedback:string) => {
    setSavingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/submissions?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: gradeVal ? Number(gradeVal) : null, feedback })
      })
      const js = await res.json()
      if (!res.ok) throw new Error(js?.error || 'Failed to save grade')
      setSubmissions(prev => prev.filter(s => s.id !== id))
    } catch (e:any) {
      setError(e?.message || 'Failed to save grade')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Grade Submissions" Sidebar={TrainerSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>Grading Queue</CardTitle>
          <CardDescription>{assignmentId ? `Assignment: ${assignmentId}` : 'All ungraded submissions for your assignments'}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? 'Loading...' : error ? <div className="text-destructive">{error}</div> : (
            <div className="space-y-4">
              {submissions.length === 0 && <div className="text-sm text-muted-foreground">No ungraded submissions.</div>}
              {submissions.map((s:any) => (
                <SubmissionRow key={s.id} s={s} onSave={grade} saving={savingId === s.id} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

function SubmissionRow({ s, onSave, saving }:{ s:any, onSave:(id:string, g:string, f:string)=>void, saving:boolean }) {
  const [g, setG] = useState("")
  const [f, setF] = useState("")
  return (
    <div className="border p-3 rounded-md">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{s.first_name || ''} {s.last_name || ''}</div>
          <div className="text-xs text-muted-foreground">{s.email}</div>
          <div className="text-xs">Assignment: {s.assignment_title}</div>
        </div>
        <a className="text-primary text-sm" href={s.content_url || '#'} target="_blank" rel="noreferrer">Open Submission</a>
      </div>
      <div className="grid md:grid-cols-3 gap-3 mt-3">
        <div>
          <Input placeholder="Grade (e.g., 90)" value={g} onChange={(e)=>setG(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Textarea placeholder="Feedback" value={f} onChange={(e)=>setF(e.target.value)} />
        </div>
      </div>
      <div className="mt-3">
        <Button size="sm" disabled={saving} onClick={()=>onSave(s.id, g, f)}>{saving ? 'Saving...' : 'Save Grade'}</Button>
      </div>
    </div>
  )
}

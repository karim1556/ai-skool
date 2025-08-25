"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth, useOrganization, useUser } from "@clerk/nextjs"

export default function TrainerSessionsPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!authLoaded || !orgLoaded || !userLoaded || !isSignedIn || !organization?.id) return
      setLoading(true); setError(null)
      try {
        await fetch('/api/sync/me', { method: 'POST' })
        const schoolRes = await fetch('/api/me/school'); const school = await schoolRes.json()
        if (!school?.id) throw new Error('No school context')
        const [bRes, tRes] = await Promise.all([
          fetch(`/api/batches?schoolId=${school.id}`),
          fetch(`/api/trainers?schoolId=${school.id}`)
        ])
        const [bjs, tjs] = await Promise.all([bRes.json(), tRes.json()])
        const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
        const me = (tjs || []).find((t:any) => (t.email || '').toLowerCase() === email)
        const sRes = await fetch(`/api/sessions?trainerId=${me?.id || ''}`)
        const sjs = await sRes.json()
        if (!active) return
        if (!sRes.ok) throw new Error(sjs?.error || 'Failed to load sessions')
        setBatches(bjs || [])
        setTrainers(tjs || [])
        setSessions(sjs || [])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, userLoaded, isSignedIn, organization?.id])

  const batchName = (id:string) => (batches.find((b:any) => b.id === id)?.name || 'Unknown')

  return (
    <RoleLayout title="Aiskool LMS" subtitle="My Sessions" Sidebar={TrainerSidebar}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sessions</h2>
        <Button asChild><Link href="/trainer/sessions/new">New Session</Link></Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? 'Loading...' : error ? <div className="text-destructive">{error}</div> : (
            <div className="divide-y">
              {sessions.length === 0 && <div className="text-sm text-muted-foreground">No sessions yet.</div>}
              {sessions.map((s:any) => (
                <div key={s.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{s.title || 'Untitled Session'}</div>
                    <div className="text-sm text-muted-foreground">Batch: {batchName(s.batch_id)} • {s.session_date || ''} {s.session_time || ''}</div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/trainer/sessions/${s.id}/attendance`}>Attendance</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

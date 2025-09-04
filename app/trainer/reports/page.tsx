"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useAuth, useOrganization, useUser } from "@clerk/nextjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TrainerReportsPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [batches, setBatches] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<any | null>(null)

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
      if (!authLoaded || !orgLoaded || !userLoaded || !isSignedIn || !organization?.id) return
      setLoading(true); setError(null)
      try {
        await fetch('/api/sync/me', { method: 'POST' })
        const [bRes, tRes] = await Promise.all([
          fetch('/api/batches'),
          fetch('/api/trainers')
        ])
        const [bjs, tjs] = await Promise.all([bRes.json(), tRes.json()])
        if (!bRes.ok) throw new Error(bjs?.error || 'Failed to load batches')
        if (!tRes.ok) throw new Error(tjs?.error || 'Failed to load trainers')
        if (!active) return
        setBatches(bjs || [])
        setTrainers(tjs || [])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load context')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, userLoaded, isSignedIn, organization?.id])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!selectedBatch) { setMetrics(null); return }
      try {
        const res = await fetch(`/api/reports/batch?batchId=${selectedBatch}`)
        const js = await res.json()
        if (!res.ok) throw new Error(js?.error || 'Failed to load report')
        if (!active) return
        setMetrics(js)
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load report')
      }
    })()
    return () => { active = false }
  }, [selectedBatch])

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Batch Reports" Sidebar={TrainerSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Select a batch to view key metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? 'Loading...' : error ? <div className="text-destructive">{error}</div> : (
            <div className="space-y-4">
              <div className="max-w-sm">
                <Select value={selectedBatch ?? ''} onValueChange={(v)=>setSelectedBatch(v)}>
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
              {selectedBatch && metrics && (
                <div className="grid md:grid-cols-3 gap-4">
                  <Stat title="Students" value={metrics.studentCount} />
                  <Stat title="Sessions" value={metrics.sessionCount} />
                  <Stat title="Attendance %" value={metrics.attendancePercent + '%'} />
                  <Stat title="Assignments" value={metrics.assignmentCount} />
                  <Stat title="Submissions" value={metrics.submissionsCount} />
                  <Stat title="Graded" value={metrics.gradedCount} />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

function Stat({ title, value }:{ title:string, value:any }) {
  return (
    <div className="border rounded-md p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { OrganizationSwitcher, useAuth, useOrganization, useUser } from "@clerk/nextjs"

export default function TrainerBatchesPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [batches, setBatches] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])

  // Sync & load
  useEffect(() => {
    if (!authLoaded || !orgLoaded || !userLoaded) return
    if (!isSignedIn || !organization?.id) return
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }) } catch {}
        const schoolRes = await fetch('/api/me/school', { cache: 'no-store' })
        if (!schoolRes.ok) throw new Error('Failed to resolve school')
        const sch = await schoolRes.json()
        const sid = sch?.schoolId
        if (!sid) throw new Error('No school linked to this organization')
        if (!active) return
        setSchoolId(sid)
        setSchoolName(sch?.name ?? null)

        const [bRes, tRes] = await Promise.all([
          fetch(`/api/batches?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' }),
          fetch(`/api/trainers?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' }),
        ])
        if (!bRes.ok) throw new Error('Failed to load batches')
        if (!tRes.ok) throw new Error('Failed to load trainers')
        const [bjson, tjson] = await Promise.all([bRes.json(), tRes.json()])
        if (!active) return
        setBatches(Array.isArray(bjson) ? bjson : [])
        setTrainers(Array.isArray(tjson) ? tjson : [])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, userLoaded, isSignedIn, organization?.id])

  const myTrainer = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
    if (!email) return null
    return trainers.find((t:any) => (t.email || '').toLowerCase() === email) || null
  }, [trainers, user?.primaryEmailAddress?.emailAddress])

  const myTrainerId = myTrainer?.id as string | undefined
  const myBatches = useMemo(() => {
    if (!myTrainerId) return [] as any[]
    return batches.filter((b:any) => {
      const ids = b.trainer_ids ? String(b.trainer_ids).split(',').filter(Boolean) : []
      return ids.includes(myTrainerId)
    })
  }, [batches, myTrainerId])

  const schoolDisplay = schoolName && schoolName !== 'Unnamed School' ? schoolName : (organization?.name || (schoolId ?? null))

  if (!authLoaded || !orgLoaded || !userLoaded) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Batches" Sidebar={TrainerSidebar}>
        <div className="p-6">Loading...</div>
      </RoleLayout>
    )
  }
  if (!isSignedIn) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Batches" Sidebar={TrainerSidebar}>
        <div className="p-6">Please sign in to continue.</div>
      </RoleLayout>
    )
  }
  if (!organization) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Batches" Sidebar={TrainerSidebar}>
        <div className="p-6">
          <p className="mb-3">Please select an organization to continue.</p>
          <OrganizationSwitcher />
        </div>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Trainer Batches" Sidebar={TrainerSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>My Batches</CardTitle>
          <CardDescription>
            {loading ? 'Loading...' : error ? error : schoolDisplay ? `School: ${schoolDisplay}` : 'No school linked'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Students</th>
                    <th className="text-left py-3 px-4">Trainers</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myBatches.length === 0 && (
                    <tr><td className="py-3 px-4 text-sm text-muted-foreground" colSpan={4}>No batches assigned</td></tr>
                  )}
                  {myBatches.map((b:any) => (
                    <tr key={b.id} className="border-b">
                      <td className="py-3 px-4 font-medium">{b.name}</td>
                      <td className="py-3 px-4">{b.student_count || 0}</td>
                      <td className="py-3 px-4">{b.trainer_count || 0}</td>
                      <td className="py-3 px-4 capitalize">{b.status || 'pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { OrganizationSwitcher, useAuth, useOrganization, useUser } from "@clerk/nextjs"

export default function TrainerStudentsPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [q, setQ] = useState("")

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

        const [sRes, bRes, tRes] = await Promise.all([
          fetch(`/api/students?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' }),
          fetch(`/api/batches?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' }),
          fetch(`/api/trainers?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' }),
        ])
        if (!sRes.ok) throw new Error('Failed to load students')
        if (!bRes.ok) throw new Error('Failed to load batches')
        if (!tRes.ok) throw new Error('Failed to load trainers')
        const [sjson, bjson, tjson] = await Promise.all([sRes.json(), bRes.json(), tRes.json()])
        if (!active) return
        setStudents(Array.isArray(sjson) ? sjson : [])
        setBatches(Array.isArray(bjson) ? bjson : [])
        setTrainers(Array.isArray(tjson) ? tjson : [])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load students')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, userLoaded, isSignedIn, organization?.id])

  // Identify current trainer
  const myTrainer = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
    if (!email) return null
    return trainers.find((t:any) => (t.email || '').toLowerCase() === email) || null
  }, [trainers, user?.primaryEmailAddress?.emailAddress])

  // Compute student set for batches assigned to current trainer
  const allowedStudentIds = useMemo(() => {
    const myId = myTrainer?.id as string | undefined
    if (!myId) return new Set<string>()
    const set = new Set<string>()
    for (const b of batches) {
      const tids = b.trainer_ids ? String(b.trainer_ids).split(',').filter(Boolean) : []
      if (tids.includes(myId)) {
        const sids = b.student_ids ? String(b.student_ids).split(',').filter(Boolean) : []
        sids.forEach(id => set.add(id))
      }
    }
    return set
  }, [batches, myTrainer?.id])

  // Filter to only those students in any of my assigned batches, then apply search
  const filtered = useMemo(() => {
    const base = students.filter((st:any) => allowedStudentIds.has(st.id))
    if (!q) return base
    const s = q.toLowerCase()
    return base.filter((st:any) => (
      `${st.first_name || ''} ${st.last_name || ''}`.toLowerCase().includes(s) ||
      (st.email || '').toLowerCase().includes(s)
    ))
  }, [students, allowedStudentIds, q])

  const schoolDisplay = schoolName && schoolName !== 'Unnamed School' ? schoolName : (organization?.name || (schoolId ?? null))

  if (!authLoaded || !orgLoaded || !userLoaded) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Students" Sidebar={TrainerSidebar}>
        <div className="p-6">Loading...</div>
      </RoleLayout>
    )
  }
  if (!isSignedIn) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Students" Sidebar={TrainerSidebar}>
        <div className="p-6">Please sign in to continue.</div>
      </RoleLayout>
    )
  }
  if (!organization) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Students" Sidebar={TrainerSidebar}>
        <div className="p-6">
          <p className="mb-3">Please select an organization to continue.</p>
          <OrganizationSwitcher />
        </div>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Trainer Students" Sidebar={TrainerSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>
            {loading ? 'Loading...' : error ? error : schoolDisplay ? `School: ${schoolDisplay}` : 'No school linked'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 max-w-sm">
            <Input placeholder="Search students..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td className="py-3 px-4 text-sm text-muted-foreground" colSpan={3}>No students found</td></tr>
                  )}
                  {filtered.map((s:any) => (
                    <tr key={s.id} className="border-b">
                      <td className="py-3 px-4 font-medium">{`${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unnamed'}</td>
                      <td className="py-3 px-4">{s.email || '-'}</td>
                      <td className="py-3 px-4">{s.phone || '-'}</td>
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

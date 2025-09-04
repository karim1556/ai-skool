"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useAuth, useOrganization, useUser } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"

export default function TrainerAssignedLevelsPage() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [levels, setLevels] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])
  const [q, setQ] = useState("")

  const myEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || null
  const myTrainer = useMemo(() => {
    if (!myEmail) return null
    return trainers.find((t:any) => (t.email || '').toLowerCase() === myEmail) || null
  }, [trainers, myEmail])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!authLoaded || !orgLoaded || !userLoaded) return
      if (!isSignedIn || !organization?.id) return
      setLoading(true)
      setError(null)
      try {
        try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }) } catch {}
        const schoolRes = await fetch('/api/me/school', { cache: 'no-store' })
        if (!schoolRes.ok) throw new Error('Failed to resolve school')
        const school = await schoolRes.json()
        const sid = school?.schoolId
        if (!sid) throw new Error('No school linked to org')
        const trRes = await fetch(`/api/trainers?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' })
        const tr = await trRes.json()
        if (!trRes.ok) throw new Error(tr?.error || 'Failed to load trainers')
        if (!active) return
        setTrainers(Array.isArray(tr) ? tr : [])
      } catch (e:any) {
        if (active) setError(e?.message || 'Load failed')
      } finally { if (active) setLoading(false) }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, userLoaded, isSignedIn, organization?.id])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!myTrainer?.id) return
      setLoading(true)
      try {
        const res = await fetch(`/api/trainers/${myTrainer.id}/levels`, { cache: 'no-store' })
        const js = await res.json()
        if (!res.ok) throw new Error(js?.error || 'Failed to load levels')
        if (!active) return
        setLevels(Array.isArray(js) ? js : [])
      } catch (e:any) {
        if (active) setError(e?.message || 'Failed to load levels')
      } finally { if (active) setLoading(false) }
    })()
    return () => { active = false }
  }, [myTrainer?.id])

  const filtered = useMemo(() => {
    if (!q.trim()) return levels
    const qq = q.toLowerCase()
    return levels.filter((l:any) => `${l.name} ${l.subtitle} ${l.category}`.toLowerCase().includes(qq))
  }, [levels, q])

  return (
    <RoleLayout title="Aiskool LMS" subtitle="My Levels" Sidebar={TrainerSidebar}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Assigned Levels</CardTitle>
            <CardDescription>Levels assigned to you by coordinators for development.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="text-sm text-destructive mb-2">{error}</div>}
            <div className="mb-4 max-w-sm"><Input placeholder="Search levels" value={q} onChange={(e)=>setQ(e.target.value)} /></div>
            {loading ? 'Loading...' : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((l:any) => (
                  <Link key={l.id} href={`/trainer/levels/${l.id}`} className="block">
                    <div className="border rounded-lg overflow-hidden hover:shadow-sm transition">
                      <Image src={l.thumbnail || '/placeholder.svg'} alt={l.name} width={640} height={360} className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <div className="font-semibold truncate">{l.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{l.subtitle || l.category}</div>
                      </div>
                    </div>
                  </Link>
                ))}
                {filtered.length === 0 && <div className="text-sm text-muted-foreground">No levels assigned yet.</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}

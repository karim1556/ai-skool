"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useAuth, useOrganization, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function TrainerLevelDetailPage() {
  const { levelId } = useParams<{ levelId: string }>()
  const id = Number(levelId)
  const router = useRouter()

  const { isLoaded: authLoaded, isSignedIn } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const { organization, isLoaded: orgLoaded } = useOrganization()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState<boolean>(false)
  const [level, setLevel] = useState<any | null>(null)
  const [courses, setCourses] = useState<any[]>([])

  // Check trainer authorization: trainer must be assigned this level
  useEffect(() => {
    let active = true
    ;(async () => {
      if (!Number.isFinite(id)) return
      if (!authLoaded || !userLoaded || !orgLoaded) return
      if (!isSignedIn || !organization?.id) { setAuthorized(false); setLoading(false); return }
      setLoading(true)
      setError(null)
      try {
        try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }) } catch {}
        const schoolRes = await fetch('/api/me/school', { cache: 'no-store' })
        const school = schoolRes.ok ? await schoolRes.json() : null
        const sid = school?.schoolId
        if (!sid) throw new Error('No school linked to org')

        const trRes = await fetch(`/api/trainers?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' })
        const tr = await trRes.json()
        if (!trRes.ok || !Array.isArray(tr)) throw new Error(tr?.error || 'Failed to load trainers')
        const myEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
        const mine = tr.find((t:any) => (t.email || '').toLowerCase() === (myEmail || ''))
        let allowed = false
        if (mine?.id) {
          const lvRes = await fetch(`/api/trainers/${mine.id}/levels`, { cache: 'no-store' })
          const lv = await lvRes.json()
          if (lvRes.ok && Array.isArray(lv)) {
            allowed = lv.some((l:any) => Number(l.id) === id)
          }
        }
        if (!active) return
        setAuthorized(Boolean(allowed))
      } catch (e:any) {
        if (active) setError(e?.message || 'Authorization failed')
      } finally { if (active) setLoading(false) }
    })()
    return () => { active = false }
  }, [id, authLoaded, userLoaded, orgLoaded, isSignedIn, organization?.id, user?.primaryEmailAddress?.emailAddress])

  // Load level + courses
  useEffect(() => {
    let active = true
    ;(async () => {
      if (!Number.isFinite(id)) return
      try {
        const [lRes, cRes] = await Promise.all([
          fetch(`/api/levels/${id}`, { cache: 'no-store' }),
          fetch(`/api/levels/${id}/courses`, { cache: 'no-store' }),
        ])
        const l = await lRes.json()
        const c = await cRes.json()
        if (!active) return
        setLevel(lRes.ok ? l : null)
        setCourses(Array.isArray(c) ? c : [])
      } catch {}
    })()
    return () => { active = false }
  }, [id])

  if (!Number.isFinite(id)) return <div className="p-6">Invalid level</div>

  return (
    <RoleLayout title="Aiskool LMS" subtitle="My Level" Sidebar={TrainerSidebar}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{level?.name || 'Level'}</CardTitle>
            <CardDescription>{level?.subtitle || level?.category || ''}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <div>Loading...</div>}
            {error && <div className="text-sm text-destructive mb-2">{error}</div>}
            {!loading && !authorized && (
              <div className="space-y-3">
                <div className="text-sm text-destructive">You do not have access to this level. It is not assigned to you.</div>
                <Button variant="outline" onClick={() => router.push('/trainer/levels')}>Back to My Levels</Button>
              </div>
            )}
            {!loading && authorized && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((c:any) => (
                  <Link key={c.id} href={`/trainer/learn/course/${c.id}`} className="block">
                    <div className="border rounded-lg overflow-hidden hover:shadow-sm transition">
                      <Image src={c.image || '/placeholder.svg'} alt={c.title} width={640} height={360} className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <div className="font-semibold truncate">{c.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{c.tagline || c.subtitle || ''}</div>
                      </div>
                    </div>
                  </Link>
                ))}
                {courses.length === 0 && <div className="text-sm text-muted-foreground">No courses yet.</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}

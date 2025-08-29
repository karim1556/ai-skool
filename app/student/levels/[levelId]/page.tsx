"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { RoleLayout } from "@/components/layout/role-layout"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function StudentLevelDetailPage() {
  const { levelId } = useParams<{ levelId: string }>()
  const id = Number(levelId)
  const router = useRouter()

  const { isLoaded: authLoaded, isSignedIn } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState<boolean>(false)
  const [level, setLevel] = useState<any | null>(null)
  const [courses, setCourses] = useState<any[]>([])

  // Gate: only show if student's batches contain this level
  useEffect(() => {
    let active = true
    ;(async () => {
      if (!Number.isFinite(id)) return
      if (!authLoaded || !userLoaded) return
      if (!isSignedIn) { setAuthorized(false); setLoading(false); return }
      setLoading(true)
      setError(null)
      try {
        // fetch enrolments for current student
        const enrRes = await fetch(`/api/batch-enrolments?studentClerkId=${encodeURIComponent(user?.id || '')}`, { cache: 'no-store' })
        const enrolments = await enrRes.json()
        if (!enrRes.ok) throw new Error(enrolments?.error || 'Failed to load enrolments')
        const batchIds: string[] = [...new Set((Array.isArray(enrolments)?enrolments:[]).map((e:any)=> e.batch_id).filter(Boolean))]
        let allowed = false
        for (const bid of batchIds) {
          const blRes = await fetch(`/api/batches/${bid}/levels`, { cache: 'no-store' })
          const bl = await blRes.json()
          if (blRes.ok && Array.isArray(bl)) {
            if (bl.some((l:any) => Number(l.id) === id)) { allowed = true; break }
          }
        }
        if (!active) return
        setAuthorized(allowed)
      } catch (e:any) {
        if (active) setError(e?.message || 'Authorization failed')
      } finally { if (active) setLoading(false) }
    })()
    return () => { active = false }
  }, [id, authLoaded, userLoaded, isSignedIn, user?.id])

  // Load level + courses (separately from auth; UI renders only if authorized)
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
    <RoleLayout title="Aiskool LMS" subtitle="My Level" Sidebar={StudentSidebar}>
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
                <div className="text-sm text-destructive">You do not have access to this level. It is not assigned to your batch.</div>
                <Button variant="outline" onClick={() => router.push('/student/levels')}>Back to My Levels</Button>
              </div>
            )}
            {!loading && authorized && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((c:any) => (
                  <Link key={c.id} href={`/student/learn/course/${c.id}`} className="block">
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

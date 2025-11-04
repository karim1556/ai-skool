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
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [studentInternalId, setStudentInternalId] = useState<string | null>(null)
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({})

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
  const enrols = Array.isArray(enrolments) ? enrolments : []
  const batchIds: string[] = [...new Set(enrols.map((e:any)=> e.batch_id).filter(Boolean))]
  // capture internal student id (uuid) returned by batch-enrolments for this clerk user
  const sid = enrols[0]?.student_id || null
        let allowed = false
        let foundBatch: string | null = null
        for (const bid of batchIds) {
          const blRes = await fetch(`/api/batches/${bid}/levels`, { cache: 'no-store' })
          const bl = await blRes.json()
          if (blRes.ok && Array.isArray(bl)) {
            if (bl.some((l:any) => Number(l.id) === id)) { allowed = true; foundBatch = bid; break }
          }
        }
        if (!active) return
  setAuthorized(allowed)
  setSelectedBatchId(foundBatch)
  setStudentInternalId(sid)
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

  // When courses, selectedBatchId and user are available, fetch per-course progress
  useEffect(() => {
    let active = true
    ;(async () => {
      if (!authorized) return
      if (!selectedBatchId) return
      if (!studentInternalId) return
      if (!courses || courses.length === 0) return
      try {
        const entries = await Promise.all(courses.map(async (c:any) => {
          try {
            const detailsRes = await fetch(`/api/courses/${c.id}/details`, { cache: 'no-store' })
            const details = await detailsRes.json()
            // count total lessons (content types in curriculum)
            let total = 0
            if (details?.curriculum && Array.isArray(details.curriculum)) {
              for (const s of details.curriculum) {
                if (Array.isArray(s.lessons)) total += s.lessons.length
              }
            }
            const progRes = await fetch(`/api/progress/lessons?courseId=${encodeURIComponent(c.id)}&role=student&studentId=${encodeURIComponent(studentInternalId)}&batchId=${encodeURIComponent(selectedBatchId)}`, { cache: 'no-store' })
            const prog = await progRes.json()
            const completed = Array.isArray(prog?.completedLessonIds) ? prog.completedLessonIds.length : 0
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0
            return [String(c.id), percent]
          } catch (e) {
            return [String(c.id), 0]
          }
        }))
        if (!active) return
        const map: Record<string, number> = {}
        for (const [k,v] of entries) map[String(k)] = Number(v)
        setCourseProgress(map)
      } catch (e) {
        // ignore
      }
    })()
    return () => { active = false }
  }, [courses, selectedBatchId, user?.id, authorized])

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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((c:any) => {
                  const progress = courseProgress[String(c.id)] ?? 0
                  const btnLabel = progress > 0 ? 'Continue' : 'Start'
                  return (
                  <div key={c.id} className="relative border rounded-lg overflow-hidden bg-white">
                    <Image src={c.image || '/placeholder.svg'} alt={c.title} width={640} height={360} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <div className="font-semibold text-lg truncate">{c.title}</div>
                      <div className="text-sm text-muted-foreground truncate">{c.tagline || c.subtitle || ''}</div>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-xs text-muted-foreground">{progress}% Completed</div>
                            <div className="text-sm text-gray-500">{/* rating placeholder */}
                              {c.rating ? `${Math.round(c.rating*10)/10}` : ''}
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                              <div className="h-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-t">
                      <Link href={`/student/learn/course/${c.id}`} className="text-sm font-medium text-sky-700">Course Detail</Link>
                      <Button onClick={() => router.push(`/student/learn/course/${c.id}`)}>{btnLabel}</Button>
                    </div>
                  </div>
                )})}
                {courses.length === 0 && <div className="text-sm text-muted-foreground">No courses yet.</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}

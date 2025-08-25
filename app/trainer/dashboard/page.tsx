"use client"

import { useEffect, useMemo, useState } from "react"
import StandardDashboard from "@/components/dashboard/StandardDashboard"
import { BookOpen, Video, UserCheck, Users, GraduationCap, Calendar } from "lucide-react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { OrganizationSwitcher, useAuth, useOrganization, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function TrainerDashboard() {
  const { counts } = useDashboardStats()
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [trainers, setTrainers] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])

  // One-time sync
  useEffect(() => {
    if (!authLoaded || !orgLoaded) return
    if (!isSignedIn || !organization?.id) return
    let done = false
    ;(async () => {
      if (done) return
      try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }) } catch {}
      done = true
    })()
  }, [authLoaded, orgLoaded, isSignedIn, organization?.id])

  // Load school-scoped data
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
        const school = await schoolRes.json()
        const sid = school?.schoolId
        if (!sid) throw new Error('No school linked to this organization')
        if (!active) return
        setSchoolId(sid)
        setSchoolName(school?.name ?? null)

        const [bRes, tRes, sRes] = await Promise.all([
          fetch(`/api/batches?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' }),
          fetch(`/api/trainers?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' }),
          fetch(`/api/students?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' }),
        ])
        if (!bRes.ok) throw new Error('Failed to load batches')
        if (!tRes.ok) throw new Error('Failed to load trainers')
        if (!sRes.ok) throw new Error('Failed to load students')
        const [bjson, tjson, sjson] = await Promise.all([bRes.json(), tRes.json(), sRes.json()])
        if (!active) return
        setBatches(Array.isArray(bjson) ? bjson : [])
        setTrainers(Array.isArray(tjson) ? tjson : [])
        setStudents(Array.isArray(sjson) ? sjson : [])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load trainer data')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, userLoaded, isSignedIn, organization?.id])

  // Identify current trainer record by email match
  const myTrainer = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
    if (!email) return null
    return trainers.find((t:any) => (t.email || '').toLowerCase() === email) || null
  }, [trainers, user?.primaryEmailAddress?.emailAddress])

  // Filter my batches by membership in batch_trainers
  const myTrainerId = myTrainer?.id as string | undefined
  const myBatchesList = useMemo(() => {
    if (!myTrainerId) return [] as any[]
    return batches.filter((b:any) => {
      const ids = b.trainer_ids ? String(b.trainer_ids).split(',').filter(Boolean) : []
      return ids.includes(myTrainerId)
    })
  }, [batches, myTrainerId])

  const schoolDisplay = schoolName && schoolName !== 'Unnamed School' ? schoolName : (organization?.name || (schoolId ?? null))

  const stats = [
    { label: "My Batches", value: myBatchesList.length, icon: <Calendar className="h-8 w-8" /> },
    { label: "Students", value: students.length, icon: <Users className="h-8 w-8" /> },
    { label: "Courses", value: counts.courses, icon: <BookOpen className="h-8 w-8" /> },
    { label: "Lessons", value: counts.lessons, icon: <Video className="h-8 w-8" /> },
  ]

  const secondaryStats = [
    { label: "Assignments", value: counts.assignments, icon: <Calendar className="h-8 w-8" /> },
    { label: "Trainers", value: trainers.length, icon: <GraduationCap className="h-8 w-8" /> },
  ]

  const activeCourses = counts.activeCourses
  const pendingCourses = counts.pendingCourses

  const activities = [
    { color: "bg-blue-50 hover:bg-blue-100 text-blue-600", title: "Welcome", description: schoolDisplay ? `School: ${schoolDisplay}` : "", time: "" },
  ]

  // Build message students handler: collect emails of students in my batches
  const messageStudents = () => {
    const myId = myTrainerId
    if (!myId) return
    const allowedIds = new Set<string>()
    for (const b of batches) {
      const tids = b.trainer_ids ? String(b.trainer_ids).split(',').filter(Boolean) : []
      if (tids.includes(myId)) {
        const sids = b.student_ids ? String(b.student_ids).split(',').filter(Boolean) : []
        sids.forEach((id:string) => allowedIds.add(id))
      }
    }
    const emails = students.filter((s:any) => allowedIds.has(s.id)).map((s:any) => s.email).filter(Boolean)
    const mailto = `mailto:?bcc=${encodeURIComponent(emails.join(','))}&subject=${encodeURIComponent('Message from Trainer')}`
    window.location.href = mailto
  }

  const quickActions = [
    { label: "Create Session", onClick: () => router.push('/trainer/sessions/new') },
    { label: "Post Assignment", onClick: () => router.push('/trainer/assignments/new') },
    { label: "Grade Submissions", onClick: () => router.push('/trainer/grade') },
    { label: "Message Students", onClick: messageStudents },
  ]

  // Loading / auth states
  if (!authLoaded || !orgLoaded || !userLoaded) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Dashboard" Sidebar={TrainerSidebar}>
        <div className="p-6">Loading...</div>
      </RoleLayout>
    )
  }
  if (!isSignedIn) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Dashboard" Sidebar={TrainerSidebar}>
        <div className="p-6">Please sign in to continue.</div>
      </RoleLayout>
    )
  }
  if (!organization) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Dashboard" Sidebar={TrainerSidebar}>
        <div className="p-6">
          <p className="mb-3">Please select an organization to continue.</p>
          <OrganizationSwitcher />
        </div>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Trainer Dashboard" Sidebar={TrainerSidebar}>
      <StandardDashboard
        title="Dashboard"
        subtitle="Trainer Panel"
        stats={stats}
        secondaryStats={secondaryStats}
        totalCourses={activeCourses + pendingCourses}
        activeCourses={activeCourses}
        pendingCourses={pendingCourses}
        quickActions={quickActions}
        activities={activities}
      />
    </RoleLayout>
  )
}

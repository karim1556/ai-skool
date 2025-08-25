"use client"

import StandardDashboard from "@/components/dashboard/StandardDashboard"
import { BookOpen, Video, UserCheck, Users, GraduationCap, Calendar } from "lucide-react"
import { RoleLayout } from "@/components/layout/role-layout"
import { CampCoordinatorSidebar } from "@/components/layout/camp-coordinator-sidebar"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { useAuth, useOrganization } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export default function CampCoordinatorDashboard() {
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { isSignedIn, orgRole, isLoaded: authLoaded } = useAuth()
  const { counts } = useDashboardStats()
  const [scopedLoading, setScopedLoading] = useState<boolean>(false)
  const [scopedError, setScopedError] = useState<string | null>(null)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [myBatches, setMyBatches] = useState<any[]>([])
  const [myTrainers, setMyTrainers] = useState<any[]>([])
  const [myStudents, setMyStudents] = useState<any[]>([])

  const stats = [
    { label: "Courses", value: counts.courses, icon: <BookOpen className="h-8 w-8" />, hint: "+2 from last month" },
    { label: "Lessons", value: counts.lessons, icon: <Video className="h-8 w-8" />, hint: "+12 from last week" },
    { label: "Enrollments", value: counts.enrollments, icon: <UserCheck className="h-8 w-8" />, hint: "+5 yesterday" },
    { label: "Students", value: counts.students, icon: <Users className="h-8 w-8" />, hint: "+8 last week" },
  ]

  const secondaryStats = [
    { label: "Trainers", value: counts.trainers, icon: <GraduationCap className="h-8 w-8" /> },
    { label: "Coordinators", value: counts.coordinators, icon: <UserCheck className="h-8 w-8" /> },
    { label: "Schools", value: counts.schools, icon: <BookOpen className="h-8 w-8" /> },
    { label: "Assignments", value: counts.assignments, icon: <Calendar className="h-8 w-8" /> },
  ]

  const activeCourses = counts.activeCourses
  const pendingCourses = counts.pendingCourses

  const activities = [
    { color: "bg-blue-50 hover:bg-blue-100 text-blue-600", title: "New camp batch created", description: "Summer Camp Batch 2025-B initialized", time: "2 hours ago" },
    { color: "bg-green-50 hover:bg-green-100 text-green-600", title: "Camp schedule updated", description: "Weekend sessions adjusted", time: "4 hours ago" },
  ]

  const quickActions = [
    { label: "Create Camp Batch" },
    { label: "Assign Trainer" },
    { label: "Manage Camp Schedule" },
    { label: "View Reports" },
  ]

  // One-time sync of my Clerk org/user into local DB without webhooks
  useEffect(() => {
    if (!authLoaded || !orgLoaded) return
    if (!isSignedIn || !organization?.id) return
    let active = true
    ;(async () => {
      setScopedLoading(true)
      setScopedError(null)
      try {
        try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }) } catch {}
        const res = await fetch('/api/me/school', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to resolve school')
        const school = await res.json()
        const sid = school?.schoolId
        if (!sid) throw new Error('No school linked to this organization')
        if (!active) return
        setSchoolId(sid)
        const [batchesRes, trainersRes, studentsRes] = await Promise.all([
          fetch(`/api/batches?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' }),
          fetch(`/api/trainers?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' }),
          fetch(`/api/students?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' }),
        ])
        if (!batchesRes.ok) throw new Error('Failed to load batches')
        if (!trainersRes.ok) throw new Error('Failed to load trainers')
        if (!studentsRes.ok) throw new Error('Failed to load students')
        const [batches, trainers, students] = await Promise.all([batchesRes.json(), trainersRes.json(), studentsRes.json()])
        if (!active) return
        setMyBatches(Array.isArray(batches) ? batches : [])
        setMyTrainers(Array.isArray(trainers) ? trainers : [])
        setMyStudents(Array.isArray(students) ? students : [])
      } catch (e: any) {
        if (!active) return
        setScopedError(e?.message || 'Failed to load your school data')
      } finally {
        if (active) setScopedLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, isSignedIn, organization?.id])

  // Normalize role: remove 'org:' prefix, lowercase, and strip spaces/hyphens/underscores
  const canonical = (role?: string | null) => (role || '')
    .toLowerCase()
    .replace(/^org:/, '')
    .replace(/[\s_-]/g, '')
  const r = canonical(orgRole)
  const allowed = new Set(['campcoordinator'])
  if (!r || !allowed.has(r)) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Camp Coordinator Dashboard" Sidebar={CampCoordinatorSidebar}>
        <div className="p-6">Access denied</div>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Camp Coordinator Dashboard" Sidebar={CampCoordinatorSidebar}>
      <StandardDashboard
        title="Dashboard"
        subtitle="Camp Coordinator Panel"
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

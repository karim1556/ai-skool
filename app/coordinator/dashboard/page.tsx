"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import StandardDashboard from "@/components/dashboard/StandardDashboard"
import { BookOpen, Video, UserCheck, Users, GraduationCap, Calendar, CheckCircle2, XCircle } from "lucide-react"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CoordinatorDashboard() {
  const { counts } = useDashboardStats()
  const [pendingEnrollments, setPendingEnrollments] = useState<number>(0)
  const [pendingBatches, setPendingBatches] = useState<any[]>([])
  const [enrollRequests, setEnrollRequests] = useState<any[]>([])
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [myBatches, setMyBatches] = useState<any[]>([])
  const [myTrainers, setMyTrainers] = useState<any[]>([])
  const [myStudents, setMyStudents] = useState<any[]>([])
  const [scopedLoading, setScopedLoading] = useState<boolean>(true)
  const [scopedError, setScopedError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      // Pending enrollments (awaiting approval)
      const enrollCountRes = await supabase
        .from("batch_enrollments")
        .select("id", { count: "exact", head: true })
        .eq("is_approved", false)
      if (mounted) setPendingEnrollments(enrollCountRes.count ?? 0)

      // Pending batches (awaiting commencement approval)
      const { data: batches } = await supabase
        .from("batches")
        .select(`
          id, name, is_approved,
          course:courses(title),
          trainer:profiles!trainer_id(full_name)
        `)
        .eq("is_approved", false)
        .order("id", { ascending: false })
      if (mounted) setPendingBatches(batches || [])

      // Enrollment requests list
      const { data: enrolls } = await supabase
        .from("batch_enrollments")
        .select(`
          id, student_id, is_approved,
          batch:batches(id, name, course:courses(title))
        `)
        .eq("is_approved", false)
        .order("id", { ascending: false })
      if (mounted) setEnrollRequests(enrolls || [])
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Determine logged-in coordinator's school and load scoped data from local APIs
  useEffect(() => {
    let active = true
    ;(async () => {
      setScopedLoading(true)
      setScopedError(null)
      try {
        // 1) Get current user email
        const cu = await getCurrentUser()
        const email = (cu?.profile as any)?.email || cu?.user?.email
        if (!email) throw new Error("Not logged in or email missing")

        // 2) Find coordinator row matching email (local SQLite API)
        const coordRes = await fetch("/api/coordinators", { cache: "no-store" })
        if (!coordRes.ok) throw new Error("Failed to load coordinators")
        const coordinators = (await coordRes.json()) as any[]
        const me = coordinators.find((c) => (c?.email || "").toLowerCase() === String(email).toLowerCase())
        if (!me?.school_id) throw new Error("Coordinator record not found or no school assigned")
        if (!active) return
        setSchoolId(me.school_id)

        // 3) Load school-scoped entities
        const [batchesRes, trainersRes, studentsRes] = await Promise.all([
          fetch(`/api/batches?schoolId=${encodeURIComponent(me.school_id)}`, { cache: "no-store" }),
          fetch(`/api/trainers?schoolId=${encodeURIComponent(me.school_id)}`, { cache: "no-store" }),
          fetch(`/api/students?schoolId=${encodeURIComponent(me.school_id)}`, { cache: "no-store" }),
        ])
        if (!batchesRes.ok) throw new Error("Failed to load batches")
        if (!trainersRes.ok) throw new Error("Failed to load trainers")
        if (!studentsRes.ok) throw new Error("Failed to load students")
        const [batches, trainers, students] = await Promise.all([batchesRes.json(), trainersRes.json(), studentsRes.json()])
        if (!active) return
        setMyBatches(Array.isArray(batches) ? batches : [])
        setMyTrainers(Array.isArray(trainers) ? trainers : [])
        setMyStudents(Array.isArray(students) ? students : [])
      } catch (e: any) {
        if (!active) return
        setScopedError(e?.message || "Failed to load your school data")
      } finally {
        if (active) setScopedLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const approveBatch = async (batchId: string | number) => {
    await supabase.from("batches").update({ is_approved: true, approved_at: new Date().toISOString() }).eq("id", batchId)
    setPendingBatches((prev) => prev.filter((b: any) => b.id !== batchId))
  }

  const approveEnrollment = async (enrollId: string | number) => {
    await supabase.from("batch_enrollments").update({ is_approved: true, approved_at: new Date().toISOString() }).eq("id", enrollId)
    setEnrollRequests((prev) => prev.filter((e: any) => e.id !== enrollId))
    setPendingEnrollments((c) => Math.max(0, c - 1))
  }

  const rejectEnrollment = async (enrollId: string | number) => {
    await supabase.from("batch_enrollments").delete().eq("id", enrollId)
    setEnrollRequests((prev) => prev.filter((e: any) => e.id !== enrollId))
    setPendingEnrollments((c) => Math.max(0, c - 1))
  }

  const stats = [
    { label: "Courses", value: counts.courses, icon: <BookOpen className="h-8 w-8" />, hint: "+2 from last month" },
    { label: "Lessons", value: counts.lessons, icon: <Video className="h-8 w-8" />, hint: "+12 from last week" },
    { label: "Enrollments", value: counts.enrollments, icon: <UserCheck className="h-8 w-8" />, hint: "+5 yesterday" },
    { label: "Students", value: counts.students, icon: <Users className="h-8 w-8" />, hint: "+8 last week" },
  ]

  const secondaryStats = [
    { label: "Trainers", value: counts.trainers, icon: <GraduationCap className="h-8 w-8" /> },
    { label: "Pending Enrollments", value: pendingEnrollments, icon: <UserCheck className="h-8 w-8" /> },
    { label: "Pending Batches", value: pendingBatches.length, icon: <Calendar className="h-8 w-8" /> },
    { label: "Schools", value: counts.schools, icon: <BookOpen className="h-8 w-8" /> },
  ]

  const activeCourses = counts.activeCourses
  const pendingCourses = counts.pendingCourses

  const activities = [
    { color: "bg-blue-50 hover:bg-blue-100 text-blue-600", title: "New instructor application received", description: "Sarah Johnson applied for Data Science instructor role", time: "2 hours ago" },
    { color: "bg-green-50 hover:bg-green-100 text-green-600", title: "Batch approved successfully", description: "Web Development Batch 2024-A has been approved", time: "4 hours ago" },
    { color: "bg-yellow-50 hover:bg-yellow-100 text-yellow-600", title: "Course completion milestone", description: "25 students completed JavaScript Fundamentals", time: "1 day ago" },
  ]

  const quickActions = [
    { label: "Approve Users" },
    { label: "Create Batch" },
    { label: "Assign Trainer" },
    { label: "View Reports" },
  ]

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Coordinator Dashboard" Sidebar={CoordinatorSidebar}>
      <StandardDashboard
        title="Dashboard"
        subtitle="Coordinator Panel"
        stats={stats}
        secondaryStats={secondaryStats}
        totalCourses={activeCourses + pendingCourses}
        activeCourses={activeCourses}
        pendingCourses={pendingCourses}
        quickActions={quickActions}
        activities={activities}
      />

      {/* Scoped to logged-in coordinator's school */}
      <div className="mt-6 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your School Overview</CardTitle>
            <CardDescription>
              {scopedLoading ? "Loading..." : scopedError ? scopedError : schoolId ? `School ID: ${schoolId}` : "No school linked"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!scopedLoading && !scopedError && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div>
                  <div className="font-medium mb-2">Batches ({myBatches.length})</div>
                  <div className="space-y-2">
                    {myBatches.slice(0, 5).map((b: any) => (
                      <div key={b.id} className="text-sm text-muted-foreground flex items-center justify-between">
                        <span>{b.name}</span>
                        <span className="text-xs">{b.status || "pending"}</span>
                      </div>
                    ))}
                    {myBatches.length === 0 && <div className="text-sm text-muted-foreground">No batches</div>}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">Trainers ({myTrainers.length})</div>
                  <div className="space-y-2">
                    {myTrainers.slice(0, 5).map((t: any) => (
                      <div key={t.id} className="text-sm text-muted-foreground">
                        {(t.first_name || "").trim()} {(t.last_name || "").trim()} {t.email ? `• ${t.email}` : ""}
                      </div>
                    ))}
                    {myTrainers.length === 0 && <div className="text-sm text-muted-foreground">No trainers</div>}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">Students ({myStudents.length})</div>
                  <div className="space-y-2">
                    {myStudents.slice(0, 5).map((s: any) => (
                      <div key={s.id} className="text-sm text-muted-foreground">
                        {(s.first_name || "").trim()} {(s.last_name || "").trim()} {s.email ? `• ${s.email}` : ""}
                      </div>
                    ))}
                    {myStudents.length === 0 && <div className="text-sm text-muted-foreground">No students</div>}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        {/* Pending Batch Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Batch Approvals</CardTitle>
            <CardDescription>Batches awaiting commencement approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingBatches.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending batches</p>
            ) : (
              <div className="space-y-3">
                {pendingBatches.map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {b.course?.title || "Untitled course"} {b.trainer?.full_name ? `• Trainer: ${b.trainer.full_name}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => approveBatch(b.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enrollment Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Requests</CardTitle>
            <CardDescription>Students requesting admission to batches</CardDescription>
          </CardHeader>
          <CardContent>
            {enrollRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No enrollment requests</p>
            ) : (
              <div className="space-y-3">
                {enrollRequests.map((e: any) => (
                  <div key={e.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{e.batch?.name || `Batch #${e.batch?.id || "?"}`}</div>
                      <div className="text-xs text-muted-foreground">
                        {e.batch?.course?.title || "Untitled course"} • Student: {e.student_id}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => rejectEnrollment(e.id)}>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" onClick={() => approveEnrollment(e.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick links row */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/coordinator/trainers/new"><Button variant="secondary">Add Trainer</Button></Link>
        <Link href="/coordinator/students/new"><Button variant="secondary">Add Student</Button></Link>
        <Link href="/coordinator/batches/new"><Button variant="secondary">Create Batch</Button></Link>
        <Link href="/coordinator/assign-trainer"><Button variant="secondary">Assign Trainer</Button></Link>
      </div>
    </RoleLayout>
  )
}

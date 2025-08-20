"use client"

import { useEffect, useState } from "react"
import StandardDashboard from "@/components/dashboard/StandardDashboard"
import { BookOpen, Video, UserCheck, Users, GraduationCap, Calendar } from "lucide-react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export default function TrainerDashboard() {
  const { counts } = useDashboardStats()
  const [activeSessions, setActiveSessions] = useState<number>(0)
  const [myBatches, setMyBatches] = useState<number>(0)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await getCurrentUser()
      const trainerId = data?.user?.id
      if (!trainerId) return
      const { count } = await supabase
        .from("sessions")
        .select("id", { count: "exact", head: true })
        .eq("trainer_id", trainerId)
        .eq("status", "active")
      if (mounted) setActiveSessions(count ?? 0)

      // My Batches count
      const { count: batchesCount } = await supabase
        .from("batches")
        .select("id", { count: "exact", head: true })
        .eq("trainer_id", trainerId)
      if (mounted) setMyBatches(batchesCount ?? 0)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const stats = [
    { label: "Courses", value: counts.courses, icon: <BookOpen className="h-8 w-8" />, hint: "+2 from last month" },
    { label: "Lessons", value: counts.lessons, icon: <Video className="h-8 w-8" />, hint: "+12 from last week" },
    { label: "Enrollments", value: counts.enrollments, icon: <UserCheck className="h-8 w-8" />, hint: "+5 yesterday" },
    { label: "Students", value: counts.students, icon: <Users className="h-8 w-8" />, hint: "+8 last week" },
  ]

  const secondaryStats = [
    { label: "Trainers", value: counts.trainers, icon: <GraduationCap className="h-8 w-8" /> },
    { label: "Active Sessions", value: activeSessions, icon: <Calendar className="h-8 w-8" /> },
    { label: "My Batches", value: myBatches, icon: <Users className="h-8 w-8" /> },
    { label: "Assignments", value: counts.assignments, icon: <Calendar className="h-8 w-8" /> },
  ]

  const activeCourses = counts.activeCourses
  const pendingCourses = counts.pendingCourses

  const activities = [
    { color: "bg-blue-50 hover:bg-blue-100 text-blue-600", title: "New assignment posted", description: "React Components assignment added to Web Dev batch", time: "2 hours ago" },
    { color: "bg-green-50 hover:bg-green-100 text-green-600", title: "Batch attendance updated", description: "Attendance marked for Web Dev Batch 2024-A", time: "4 hours ago" },
  ]

  const quickActions = [
    { label: "Create Session" },
    { label: "Post Assignment" },
    { label: "Grade Submissions" },
    { label: "Message Students" },
  ]

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

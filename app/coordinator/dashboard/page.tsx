"use client"

import { useEffect, useState } from "react"
import StandardDashboard from "@/components/dashboard/StandardDashboard"
import { BookOpen, Video, UserCheck, Users, GraduationCap, Calendar } from "lucide-react"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export default function CoordinatorDashboard() {
  const { counts } = useDashboardStats()
  const [pendingEnrollments, setPendingEnrollments] = useState<number>(0)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      // Coordinator-wide pending enrollments (awaiting approval)
      const { count } = await supabase
        .from("batch_enrollments")
        .select("id", { count: "exact", head: true })
        .eq("is_approved", false)
      if (mounted) setPendingEnrollments(count ?? 0)
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
    { label: "Pending Enrollments", value: pendingEnrollments, icon: <UserCheck className="h-8 w-8" /> },
    { label: "Schools", value: counts.schools, icon: <BookOpen className="h-8 w-8" /> },
    { label: "Assignments", value: counts.assignments, icon: <Calendar className="h-8 w-8" /> },
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
    </RoleLayout>
  )
}

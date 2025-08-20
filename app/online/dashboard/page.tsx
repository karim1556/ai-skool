"use client"

import StandardDashboard from "@/components/dashboard/StandardDashboard"
import { BookOpen, Video, UserCheck, Users, GraduationCap, Calendar } from "lucide-react"
import { RoleLayout } from "@/components/layout/role-layout"
import { OnlineStudentSidebar } from "@/components/layout/online-student-sidebar"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

export default function OnlineStudentDashboard() {
  const { counts } = useDashboardStats()

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
    { color: "bg-blue-50 hover:bg-blue-100 text-blue-600", title: "New live webinar", description: "Join the upcoming React Hooks webinar", time: "2 hours ago" },
    { color: "bg-green-50 hover:bg-green-100 text-green-600", title: "Assignment graded", description: "Your assignment in JS Fundamentals was graded", time: "4 hours ago" },
  ]

  const quickActions = [
    { label: "Browse Courses" },
    { label: "Join Live Session" },
    { label: "Check Assignments" },
    { label: "View Progress" },
  ]

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Online Student Dashboard" Sidebar={OnlineStudentSidebar}>
      <StandardDashboard
        title="Dashboard"
        subtitle="Online Student Panel"
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

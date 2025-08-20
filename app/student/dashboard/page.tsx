"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { getCurrentUser } from "@/lib/auth"

export default function StudentDashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await getCurrentUser()
      if (!mounted) return
      setUserId(data?.user?.id ?? null)
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Student Dashboard" Sidebar={StudentSidebar}>
      {userId ? <StudentDashboard userId={userId} /> : null}
    </RoleLayout>
  )
}

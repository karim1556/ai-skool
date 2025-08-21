"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
      {userId ? (
        <StudentDashboard userId={userId} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>You're not signed in</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Please sign in to view your student dashboard.</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </RoleLayout>
  )
}

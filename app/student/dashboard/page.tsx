"use client"

import { RoleLayout } from "@/components/layout/role-layout"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth, useOrganization } from "@clerk/nextjs"

export default function StudentDashboardPage() {
  const { isSignedIn, userId, isLoaded } = useAuth()
  const { organization } = useOrganization()

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Student Dashboard" Sidebar={StudentSidebar}>
      {isLoaded && isSignedIn ? (
        <StudentDashboard userId={userId as string} />
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

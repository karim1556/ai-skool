"use client"

import { RoleLayout } from "@/components/layout/role-layout"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudentBatchesPage() {
  return (
    <RoleLayout title="Aiskool LMS" subtitle="My Batches" Sidebar={StudentSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>My Batches</CardTitle>
        </CardHeader>
        <CardContent>
          Coming soon. Use Dashboard for now.
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

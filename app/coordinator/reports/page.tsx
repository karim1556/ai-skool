"use client"

import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"

export default function CoordinatorReportsPage() {
  return (
    <RoleLayout title="Aiskool LMS" subtitle="Reports" Sidebar={CoordinatorSidebar}>
      <h1 className="text-xl font-semibold mb-4">Reports</h1>
      <p className="text-sm text-muted-foreground">Batch/Trainer/Student performance reports. Coming soon.</p>
    </RoleLayout>
  )
}

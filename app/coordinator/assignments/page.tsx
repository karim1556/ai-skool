"use client"

import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"

export default function CoordinatorAssignmentsPage() {
  return (
    <RoleLayout title="Aiskool LMS" subtitle="Assignments" Sidebar={CoordinatorSidebar}>
      <h1 className="text-xl font-semibold mb-4">Assignments</h1>
      <p className="text-sm text-muted-foreground">Assignments management for coordinators. Coming soon.</p>
    </RoleLayout>
  )
}

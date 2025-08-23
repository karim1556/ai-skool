"use client"

import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { Protect } from "@clerk/nextjs"

export default function CoordinatorSettingsPage() {
  return (
    <Protect
    role="schoolcoordinator"
    fallback={<p>Access denied</p>}
    >
    <RoleLayout title="Aiskool LMS" subtitle="Settings" Sidebar={CoordinatorSidebar}>
      <h1 className="text-xl font-semibold mb-4">Settings</h1>
      <p className="text-sm text-muted-foreground">Coordinator settings. Coming soon.</p>
    </RoleLayout>
    </Protect>
  )
}

"use client"

import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CoordinatorSchoolsPage() {
  return (
    <RoleLayout title="Aiskool LMS" subtitle="Schools" Sidebar={CoordinatorSidebar}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Schools</h1>
        <div className="flex gap-2">
          <Link href="/admin/schools/add"><Button>Add School (Admin)</Button></Link>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">School listing for coordinators. Coming soon.</p>
    </RoleLayout>
  )
}

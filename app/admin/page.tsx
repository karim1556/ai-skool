"use client"

import { useEffect, useState } from "react"
import { EnhancedAdminDashboard } from "@/components/dashboard/enhanced-admin-dashboard"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Protect } from "@clerk/nextjs"
import { getCurrentMockUser } from "@/lib/mock-auth"

export default function AdminDashboardPage() {
  const [mockUser, setMockUser] = useState<any | null>(null)

  useEffect(() => {
    setMockUser(getCurrentMockUser())
  }, [])

  // If a local mock user is present (dev/demo mode), allow the mock admin user
  // to see the dashboard without requiring a Clerk session. This keeps the
  // developer experience smooth when using the demo/local auth flow.
  if (mockUser) {
    if (mockUser.role === "admin") {
      return (
        <AdminLayout>
          <EnhancedAdminDashboard />
        </AdminLayout>
      )
    }

    return <p>Access denied</p>
  }

  // Otherwise, fall back to Clerk's Protect for real auth flows.
  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
      <AdminLayout>
        <EnhancedAdminDashboard />
      </AdminLayout>
    </Protect>
  )
}

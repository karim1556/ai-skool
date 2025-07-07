"use client"

import { EnhancedAdminDashboard } from "./enhanced-admin-dashboard"
import { AdminLayout } from "../layout/admin-layout"

export function MockAdminDashboard() {
  return (
    <AdminLayout>
      <EnhancedAdminDashboard />
    </AdminLayout>
  )
}

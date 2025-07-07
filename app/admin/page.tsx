import { EnhancedAdminDashboard } from "@/components/dashboard/enhanced-admin-dashboard"
import { AdminLayout } from "@/components/layout/admin-layout"

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <EnhancedAdminDashboard />
    </AdminLayout>
  )
}

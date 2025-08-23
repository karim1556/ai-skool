import { EnhancedAdminDashboard } from "@/components/dashboard/enhanced-admin-dashboard"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Protect } from "@clerk/nextjs"

export default function AdminDashboardPage() {
  return (
    <Protect
    role="admin"
    fallback={<p>Access denied</p>}
    >
    <AdminLayout>
      <EnhancedAdminDashboard />
    </AdminLayout>
    </Protect>
  )
}

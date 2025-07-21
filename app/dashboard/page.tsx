"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentMockUser, signOutMock } from "@/lib/mock-auth"
import { MockAdminDashboard } from "@/components/dashboard/mock-admin-dashboard"
import { TrainerDashboard } from "@/components/dashboard/trainer-dashboard"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut, ArrowLeft } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = getCurrentMockUser()
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(userData)
    setLoading(false)
  }, [router])

  const handleSignOut = () => {
    signOutMock()
    router.push("/")
  }

  const handleBackToRoleSelector = () => {
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">User not found</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    )
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <MockAdminDashboard />
      case "trainer":
      case "instructor":
        return <TrainerDashboard userId={user.id} />
      case "student":
      case "school_coordinator":
      case "camp_coordinator":
        return <StudentDashboard userId={user.id} />
      default:
        return <div>Unknown role</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackToRoleSelector}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Switch Role
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Welcome, {user.name}</h1>
              <p className="text-sm text-muted-foreground capitalize">{user.role.replace("_", " ")}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">{renderDashboard()}</main>
    </div>
  )
}

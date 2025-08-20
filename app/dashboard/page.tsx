"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentMockUser } from "@/lib/mock-auth"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentMockUser()
    if (!user) {
      router.replace("/login")
      return
    }

    const role = (user.role || "").toLowerCase()
    let target = "/login"

    switch (role) {
      case "admin":
        target = "/admin"
        break
      case "trainer":
        target = "/trainer/dashboard"
        break
      case "instructor":
        target = "/instructor/dashboard"
        break
      case "student":
        target = "/student/dashboard"
        break
      case "coordinator":
      case "school_coordinator":
        target = "/coordinator/dashboard"
        break
      case "camp_coordinator":
        target = "/camp-coordinator/dashboard"
        break
      case "online_student":
        target = "/online/dashboard"
        break
      default:
        target = "/login"
    }

    router.replace(target)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Redirecting to your dashboard…</p>
      </div>
    </div>
  )
}

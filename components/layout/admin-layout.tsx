"use client"

import React, { useEffect, useState } from "react"

import { AdminSidebar } from "./admin-sidebar"
import { Button } from "@/components/ui/button"
import { LogOut, ArrowLeft, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOutMock, getCurrentMockUser } from "@/lib/mock-auth"
import { Badge } from "@/components/ui/badge"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<ReturnType<typeof getCurrentMockUser> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = getCurrentMockUser()
    setUser(u)
    setLoading(false)
  }, [])

  const handleSignOut = () => {
    signOutMock()
    router.push("/")
  }

  const handleBackToRoleSelector = () => {
    router.push("/login")
  }

  if (loading) {
    // Optionally, you can return a spinner or skeleton here
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToRoleSelector}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Switch Role
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Aiskool LMS</h1>
                <p className="text-sm text-gray-500">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user?.name?.charAt(0) || "A"}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

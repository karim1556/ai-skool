"use client"

import React, { useEffect, useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { Button } from "@/components/ui/button"
import { LogOut, ArrowLeft, Bell, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOutMock, getCurrentMockUser } from "@/lib/mock-auth"
import { Badge } from "@/components/ui/badge"
import { UserButton } from "@clerk/nextjs"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<ReturnType<typeof getCurrentMockUser> | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop, drawer for mobile */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity md:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 shadow-lg transition-transform md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile menu button */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleBackToRoleSelector}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Switch Role</span>
              </Button>
              <div>
                <h1 className="text-lg md:text-xl font-semibold">Aiskool LMS</h1>
                <p className="text-xs md:text-sm text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-right">
                  <p className="text-xs md:text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <UserButton/>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

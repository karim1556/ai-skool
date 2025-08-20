"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Calendar, ClipboardList, BarChart3, Settings, Tent, BookOpen } from "lucide-react"

const items = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Camp Batches", href: "/camp-coordinator/batches", icon: Calendar },
  { title: "Camp Students", href: "/camp-coordinator/students", icon: Users },
  { title: "Assignments", href: "/camp-coordinator/assignments", icon: ClipboardList },
  { title: "Reports", href: "/camp-coordinator/reports", icon: BarChart3 },
  { title: "Settings", href: "/camp-coordinator/settings", icon: Settings },
]

export function CampCoordinatorSidebar() {
  const pathname = usePathname()
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Tent className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Aiskool</h2>
            <p className="text-sm text-gray-500">Camp Coordinator</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</div>
          {items.map((item) => (
            <Link key={item.title} href={item.href}>
              <Button
                variant="ghost"
                className={cn("w-full justify-start font-normal", pathname === item.href && "bg-blue-50 text-blue-700")}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

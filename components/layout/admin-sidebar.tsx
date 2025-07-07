"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  LayoutDashboard,
  FolderTree,
  BookOpen,
  Users,
  School,
  UserCheck,
  GraduationCap,
  Calendar,
  ClipboardList,
  UserPlus,
  Settings,
  BarChart3,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Categories",
    icon: FolderTree,
    items: [
      { title: "Categories", href: "/admin/categories" },
      { title: "Add new category", href: "/admin/categories/new" },
      { title: "Add category section", href: "/admin/categories/sections" },
    ],
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Instructors",
    icon: Users,
    items: [
      { title: "Instructor list", href: "/admin/instructors" },
      { title: "Instructor payout", href: "/admin/instructors/payout", badge: "0" },
      { title: "Instructor settings", href: "/admin/instructors/settings" },
      { title: "Instructor application", href: "/admin/instructors/applications", badge: "1" },
    ],
  },
  {
    title: "Schools",
    href: "/admin/schools",
    icon: School,
  },
  {
    title: "Coordinators",
    href: "/admin/coordinators",
    icon: UserCheck,
  },
  {
    title: "Trainers",
    href: "/admin/trainers",
    icon: GraduationCap,
  },
  {
    title: "Batches",
    href: "/admin/batches",
    icon: Calendar,
  },
  {
    title: "Assignments",
    href: "/admin/assignments",
    icon: ClipboardList,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: UserPlus,
  },
  {
    title: "Enrolment",
    icon: UserPlus,
    items: [
      { title: "Enrol history", href: "/admin/enrolment/history" },
      { title: "Enrol a student", href: "/admin/enrolment/new" },
      { title: "Enrol to batch", href: "/admin/enrolment/batch" },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    items: [
      { title: "Batch wise report", href: "/admin/reports/batch" },
      { title: "Course wise report", href: "/admin/reports/course" },
      { title: "Trainer wise report", href: "/admin/reports/trainer" },
      { title: "Student wise report", href: "/admin/reports/student" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      { title: "System settings", href: "/admin/settings/system" },
      { title: "Website settings", href: "/admin/settings/website" },
      { title: "Certificate settings", href: "/admin/settings/certificate" },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState<string[]>(["Dashboard"])

  const toggleItem = (title: string) => {
    setOpenItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Aiskool</h2>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</div>

          {navigationItems.map((item) => (
            <div key={item.title}>
              {item.items ? (
                <Collapsible open={openItems.includes(item.title)} onOpenChange={() => toggleItem(item.title)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between text-left font-normal",
                        openItems.includes(item.title) && "bg-blue-50 text-blue-700",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {openItems.includes(item.title) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 ml-6 mt-1">
                    {item.items.map((subItem) => (
                      <Link key={subItem.href} href={subItem.href}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start font-normal text-gray-600 hover:text-gray-900",
                            pathname === subItem.href && "bg-blue-50 text-blue-700",
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{subItem.title}</span>
                            {subItem.badge && (
                              <Badge variant="secondary" className="ml-2">
                                {subItem.badge}
                              </Badge>
                            )}
                          </div>
                        </Button>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link href={item.href!}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start font-normal",
                      pathname === item.href && "bg-blue-50 text-blue-700",
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.title}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

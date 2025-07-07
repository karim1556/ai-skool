"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, GraduationCap, Settings, School, Tent } from "lucide-react"

const roles = [
  {
    id: "admin",
    name: "Admin",
    description: "Full system access, user management, batch approvals",
    icon: Settings,
    color: "bg-red-100 text-red-800 border-red-200",
    user: {
      id: "admin-1",
      name: "System Administrator",
      email: "admin@eduflow.com",
    },
  },
  {
    id: "trainer",
    name: "Trainer",
    description: "Batch management, session control, attendance tracking",
    icon: Users,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    user: {
      id: "trainer-1",
      name: "John Smith",
      email: "trainer@eduflow.com",
    },
  },
  {
    id: "instructor",
    name: "Instructor",
    description: "Course instruction and student guidance",
    icon: BookOpen,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    user: {
      id: "instructor-1",
      name: "Sarah Johnson",
      email: "instructor@eduflow.com",
    },
  },
  {
    id: "student",
    name: "Student",
    description: "Course enrollment, session participation, assignments",
    icon: GraduationCap,
    color: "bg-green-100 text-green-800 border-green-200",
    user: {
      id: "student-1",
      name: "Mike Davis",
      email: "student@eduflow.com",
    },
  },
  {
    id: "school_coordinator",
    name: "School Coordinator",
    description: "Registration oversight, student management",
    icon: School,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    user: {
      id: "coordinator-1",
      name: "Emily Wilson",
      email: "coordinator@eduflow.com",
    },
  },
  {
    id: "camp_coordinator",
    name: "Camp Coordinator",
    description: "Workshop and camp management",
    icon: Tent,
    color: "bg-orange-100 text-orange-800 border-orange-200",
    user: {
      id: "camp-1",
      name: "David Brown",
      email: "camp@eduflow.com",
    },
  },
]

export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<string>("")
  const router = useRouter()

  const handleRoleSelect = (role: any) => {
    // Store user data in localStorage for demo purposes
    localStorage.setItem(
      "demo-user",
      JSON.stringify({
        ...role.user,
        role: role.id,
        is_approved: true,
      }),
    )

    // Navigate to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Role</h1>
          <p className="text-muted-foreground">Select a role to explore the dashboard UI</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => {
            const IconComponent = role.icon
            return (
              <Card
                key={role.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => handleRoleSelect(role)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{role.user.name}</p>
                      </div>
                    </div>
                    <Badge className={role.color}>{role.name}</Badge>
                  </div>
                  <CardDescription className="text-sm mt-2">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">View {role.name} Dashboard</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            This is a demo mode. Click any role to see the corresponding dashboard interface.
          </p>
        </div>
      </div>
    </div>
  )
}

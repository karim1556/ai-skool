import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye, Mail, Phone } from "lucide-react"
import { Protect } from "@clerk/nextjs"

export default function InstructorsPage() {
  const instructors = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1234567890",
      specialization: "Web Development",
      courses: 3,
      students: 120,
      status: "active",
      joined: "2024-01-10",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1234567891",
      specialization: "Data Science",
      courses: 2,
      students: 85,
      status: "active",
      joined: "2024-01-15",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike@example.com",
      phone: "+1234567892",
      specialization: "Digital Marketing",
      courses: 1,
      students: 45,
      status: "pending",
      joined: "2024-01-20",
    },
  ]

  return (
    <Protect
    role="admin"
    fallback={<p>Access denied</p>}
    >
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Instructors</h1>
            <p className="text-muted-foreground">Manage all instructors in the system</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Instructor
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <Card key={instructor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{instructor.name}</CardTitle>
                    <CardDescription>{instructor.specialization}</CardDescription>
                  </div>
                  <Badge variant={instructor.status === "active" ? "default" : "secondary"}>{instructor.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{instructor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{instructor.phone}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <div className="font-semibold">{instructor.courses}</div>
                      <div className="text-xs text-gray-500">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{instructor.students}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
    </Protect>
  )
}

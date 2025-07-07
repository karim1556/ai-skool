"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { Plus } from "lucide-react"
import { mockStudents } from "@/lib/mock-data"
import Link from "next/link"

export default function StudentsPage() {
  const [students, setStudents] = useState(mockStudents)

  const handleView = (id: number) => {
    console.log("View student:", id)
  }

  const handleEdit = (id: number) => {
    console.log("Edit student:", id)
  }

  const handleDelete = (id: number) => {
    setStudents(students.filter((student) => student.id !== id))
  }

  const handleApprove = (id: number) => {
    setStudents(students.map((student) => (student.id === id ? { ...student, status: "Verified" } : student)))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student</h1>
          </div>
          <Button asChild>
            <Link href="/admin/students/add">
              <Plus className="h-4 w-4 mr-2" />
              Add student
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>STUDENT</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={students} searchFields={["name", "email", "enrolledCourses", "school"]} title="Students">
              {(paginatedStudents) => (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Photo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Enrolled courses</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">School</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.map((student, index) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={student.photo || "/placeholder.svg"} />
                              <AvatarFallback>{student.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </td>
                          <td className="py-4 px-4">
                            <div className="max-w-xs">
                              <div className="font-medium">{student.name}</div>
                              <Badge variant="secondary" className="mt-1 text-xs bg-red-100 text-red-800">
                                Status: {student.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-4 px-4">{student.email}</td>
                          <td className="py-4 px-4">{student.enrolledCourses}</td>
                          <td className="py-4 px-4">{student.school}</td>
                          <td className="py-4 px-4">
                            <ActionDropdown
                              onView={() => handleView(student.id)}
                              onEdit={() => handleEdit(student.id)}
                              onDelete={() => handleDelete(student.id)}
                              onApprove={() => handleApprove(student.id)}
                              showApprove={student.status === "Unverified"}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DataTable>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

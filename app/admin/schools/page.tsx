"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/ui/data-table"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { Plus } from "lucide-react"
import { mockSchools } from "@/lib/mock-data"
import Link from "next/link"

export default function SchoolsPage() {
  const [schools, setSchools] = useState(mockSchools)

  const handleView = (id: number) => {
    console.log("View school:", id)
  }

  const handleEdit = (id: number) => {
    console.log("Edit school:", id)
  }

  const handleDelete = (id: number) => {
    setSchools(schools.filter((school) => school.id !== id))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">School</h1>
          </div>
          <Button asChild>
            <Link href="/admin/schools/add">
              <Plus className="h-4 w-4 mr-2" />
              Add School
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>SCHOOL</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={schools} searchFields={["schoolName", "contactPerson", "email", "phone"]} title="Schools">
              {(paginatedSchools) => (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Logo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">School Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Contact Person</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Students</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedSchools.map((school, index) => (
                        <tr key={school.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={school.logo || "/placeholder.svg"} />
                              <AvatarFallback>{school.schoolName.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </td>
                          <td className="py-4 px-4 font-medium">{school.schoolName}</td>
                          <td className="py-4 px-4">{school.contactPerson}</td>
                          <td className="py-4 px-4">{school.email}</td>
                          <td className="py-4 px-4">{school.phone}</td>
                          <td className="py-4 px-4">{school.students}</td>
                          <td className="py-4 px-4">
                            <ActionDropdown
                              onView={() => handleView(school.id)}
                              onEdit={() => handleEdit(school.id)}
                              onDelete={() => handleDelete(school.id)}
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

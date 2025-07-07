"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/ui/data-table"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { Plus } from "lucide-react"
import { mockCoordinators } from "@/lib/mock-data"
import Link from "next/link"

export default function CoordinatorsPage() {
  const [coordinators, setCoordinators] = useState(mockCoordinators)

  const handleView = (id: number) => {
    console.log("View coordinator:", id)
  }

  const handleEdit = (id: number) => {
    console.log("Edit coordinator:", id)
  }

  const handleDelete = (id: number) => {
    setCoordinators(coordinators.filter((coordinator) => coordinator.id !== id))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Coordinator</h1>
          </div>
          <Button asChild>
            <Link href="/admin/coordinators/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Coordinator
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>COORDINATOR</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={coordinators} searchFields={["name", "email", "phone", "institute"]} title="Coordinators">
              {(paginatedCoordinators) => (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Photo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Gender</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">DOB</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Institute</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCoordinators.map((coordinator, index) => (
                        <tr key={coordinator.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={coordinator.photo || "/placeholder.svg"} />
                              <AvatarFallback>{coordinator.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </td>
                          <td className="py-4 px-4 font-medium">{coordinator.name}</td>
                          <td className="py-4 px-4">{coordinator.gender}</td>
                          <td className="py-4 px-4">{coordinator.dob}</td>
                          <td className="py-4 px-4">{coordinator.phone}</td>
                          <td className="py-4 px-4">{coordinator.email}</td>
                          <td className="py-4 px-4">{coordinator.institute}</td>
                          <td className="py-4 px-4">
                            <ActionDropdown
                              onView={() => handleView(coordinator.id)}
                              onEdit={() => handleEdit(coordinator.id)}
                              onDelete={() => handleDelete(coordinator.id)}
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

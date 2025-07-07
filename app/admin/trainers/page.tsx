"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/ui/data-table"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { Plus } from "lucide-react"
import { mockTrainers } from "@/lib/mock-data"
import Link from "next/link"

export default function TrainersPage() {
  const [trainers, setTrainers] = useState(mockTrainers)

  const handleView = (id: number) => {
    console.log("View trainer:", id)
  }

  const handleEdit = (id: number) => {
    console.log("Edit trainer:", id)
  }

  const handleDelete = (id: number) => {
    setTrainers(trainers.filter((trainer) => trainer.id !== id))
  }

  const handleApprove = (id: number) => {
    setTrainers(trainers.map((trainer) => (trainer.id === id ? { ...trainer, status: "active" } : trainer)))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Trainer</h1>
          </div>
          <Button asChild>
            <Link href="/admin/trainers/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Trainer
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>TRAINER</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={trainers} searchFields={["name", "email", "phone", "institute"]} title="Trainers">
              {(paginatedTrainers) => (
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
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTrainers.map((trainer, index) => (
                        <tr key={trainer.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={trainer.photo || "/placeholder.svg"} />
                              <AvatarFallback>{trainer.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </td>
                          <td className="py-4 px-4 font-medium">{trainer.name}</td>
                          <td className="py-4 px-4">{trainer.gender}</td>
                          <td className="py-4 px-4">{trainer.dob}</td>
                          <td className="py-4 px-4">{trainer.phone}</td>
                          <td className="py-4 px-4">{trainer.email}</td>
                          <td className="py-4 px-4">{trainer.institute}</td>
                          <td className="py-4 px-4">
                            <Badge variant={trainer.status === "active" ? "default" : "secondary"}>
                              {trainer.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <ActionDropdown
                              onView={() => handleView(trainer.id)}
                              onEdit={() => handleEdit(trainer.id)}
                              onDelete={() => handleDelete(trainer.id)}
                              onApprove={() => handleApprove(trainer.id)}
                              showApprove={trainer.status === "pending"}
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

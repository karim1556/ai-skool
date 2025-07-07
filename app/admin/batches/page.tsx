"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { Plus } from "lucide-react"
import { mockBatches } from "@/lib/mock-data"
import Link from "next/link"

export default function BatchesPage() {
  const [batches, setBatches] = useState(mockBatches)

  const handleView = (id: number) => {
    console.log("View batch:", id)
  }

  const handleEdit = (id: number) => {
    console.log("Edit batch:", id)
  }

  const handleDelete = (id: number) => {
    setBatches(batches.filter((batch) => batch.id !== id))
  }

  const handleApprove = (id: number) => {
    setBatches(batches.map((batch) => (batch.id === id ? { ...batch, status: "active" } : batch)))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Batch</h1>
          </div>
          <Button asChild>
            <Link href="/admin/batches/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Batch
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>BATCH</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={batches} searchFields={["batchId", "batchName", "trainer", "course"]} title="Batches">
              {(paginatedBatches) => (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Batch ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Batch Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Trainer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Students</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBatches.map((batch, index) => (
                        <tr key={batch.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4 font-medium">{batch.batchId}</td>
                          <td className="py-4 px-4">{batch.batchName}</td>
                          <td className="py-4 px-4">{batch.trainer}</td>
                          <td className="py-4 px-4">{batch.course}</td>
                          <td className="py-4 px-4">
                            <span className="text-sm">
                              {batch.noOfStudents}/{batch.maxStudents}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              variant={
                                batch.status === "active"
                                  ? "default"
                                  : batch.status === "pending"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {batch.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <ActionDropdown
                              onView={() => handleView(batch.id)}
                              onEdit={() => handleEdit(batch.id)}
                              onDelete={() => handleDelete(batch.id)}
                              onApprove={() => handleApprove(batch.id)}
                              showApprove={batch.status === "pending"}
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

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/ui/data-table"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { Plus } from "lucide-react"
import Link from "next/link"

type Row = {
  id: string | number
  logo?: string | null
  schoolName: string
  contactPerson?: string | null
  email?: string | null
  phone?: string | null
  students?: number | null
}

export default function SchoolsPage() {
  const router = useRouter()
  const [schools, setSchools] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/schools", { cache: "no-store" })
        const data = await res.json()
        const mapped: Row[] = (Array.isArray(data) ? data : []).map((s: any) => ({
          id: s.id,
          logo: s.logo_url,
          schoolName: s.name,
          contactPerson: s.principal,
          email: s.email,
          phone: s.phone,
          students: s.student_count ?? null,
        }))
        setSchools(mapped)
      } catch (e) {
        console.error("Failed to load schools", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleView = (id: string | number) => {
    router.push(`/schools/${id}`)
  }

  const handleEdit = (id: string | number) => {
    router.push(`/admin/schools/${id}/edit`)
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm("Delete this school? This cannot be undone.")) return
    const prev = schools
    setSchools(schools.filter((school) => school.id !== id))
    try {
      const res = await fetch(`/api/schools/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
    } catch (e) {
      console.error(e)
      // revert on failure
      setSchools(prev)
      alert("Failed to delete school")
    }
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
                      {loading ? (
                        <tr>
                          <td colSpan={8} className="py-6 text-center text-gray-500">Loading...</td>
                        </tr>
                      ) : paginatedSchools.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-6 text-center text-gray-500">No schools found</td>
                        </tr>
                      ) : paginatedSchools.map((school, index) => (
                        <tr key={school.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={(school as any).logo || "/placeholder.svg"} />
                              <AvatarFallback>{(school as any).schoolName?.charAt(0)?.toUpperCase() || "S"}</AvatarFallback>
                            </Avatar>
                          </td>
                          <td className="py-4 px-4 font-medium">{(school as any).schoolName}</td>
                          <td className="py-4 px-4">{(school as any).contactPerson}</td>
                          <td className="py-4 px-4">{(school as any).email}</td>
                          <td className="py-4 px-4">{(school as any).phone}</td>
                          <td className="py-4 px-4">{(school as any).students ?? '-'}</td>
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

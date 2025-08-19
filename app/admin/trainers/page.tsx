"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/ui/data-table"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function TrainersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [trainers, setTrainers] = useState<Array<{
    id: string
    name: string
    email?: string | null
    phone?: string | null
    institute?: string | null
    gender?: string | null
    dob?: string | null
    photo?: string | null
    status?: string | null
  }>>([])
  const [schoolNameById, setSchoolNameById] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = async () => {
      try {
        const [rowsRes, schoolsRes] = await Promise.all([
          fetch("/api/trainers", { cache: "no-store" }),
          fetch("/api/schools", { cache: "no-store" }),
        ])
        const [rows, schools] = await Promise.all([rowsRes.json(), schoolsRes.json()])
        if (Array.isArray(schools)) {
          const map: Record<string, string> = {}
          for (const s of schools) {
            if (s?.id) map[s.id] = s.name ?? s.id
          }
          setSchoolNameById(map)
        }
        if (Array.isArray(rows)) {
          const mapped = rows.map((r: any) => ({
            id: r.id,
            name: `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "Trainer",
            email: r.email ?? null,
            phone: r.phone ?? null,
            institute: r.school_id ?? null,
            gender: r.gender ?? null,
            dob: r.dob ? String(r.dob).slice(0, 10) : null,
            photo: r.image_url ?? null,
            status: r.status ?? null,
          }))
          setTrainers(mapped)
        }
      } catch (_) {}
    }
    load()
  }, [])

  const handleView = (id: string) => {
    console.log("View trainer:", id)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/trainers/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    const ok = typeof window !== 'undefined' ? window.confirm('Are you sure you want to delete this trainer?') : true
    if (!ok) return
    try {
      const res = await fetch(`/api/trainers?id=${id}`, { method: 'DELETE' })
      let data: any = null
      try { data = await res.json() } catch (_) {}
      if (!res.ok) {
        const msg = data?.error || data?.message || (await res.text().catch(() => 'Failed to delete'))
        throw new Error(`${res.status} ${res.statusText}: ${msg}`)
      }
      setTrainers((prev) => prev.filter((c) => c.id !== id))
      toast({ title: 'Trainer deleted' })
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || String(e) || 'Failed to delete trainer', variant: 'destructive' })
    }
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
                      {paginatedTrainers.map((trainer: any, index: number) => (
                        <tr key={trainer.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">{index + 1}</td>
                          <td className="py-4 px-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={trainer.photo || "/placeholder.svg"} />
                              <AvatarFallback>{(trainer.name?.charAt(0) || 'T').toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </td>
                          <td className="py-4 px-4 font-medium">{trainer.name}</td>
                          <td className="py-4 px-4">{trainer.gender || "—"}</td>
                          <td className="py-4 px-4">{trainer.dob || "—"}</td>
                          <td className="py-4 px-4">{trainer.phone}</td>
                          <td className="py-4 px-4">{trainer.email}</td>
                          <td className="py-4 px-4">{schoolNameById[trainer.institute as string] || trainer.institute || "—"}</td>
                          <td className="py-4 px-4">{trainer.status || '—'}</td>
                          <td className="py-4 px-4">
                            <ActionDropdown
                              onView={() => handleView(trainer.id)}
                              onEdit={() => handleEdit(trainer.id)}
                              onDelete={() => handleDelete(trainer.id)}
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

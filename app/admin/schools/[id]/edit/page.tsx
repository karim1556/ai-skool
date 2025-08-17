"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditSchoolPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/schools/${id}`, { cache: "no-store" })
        const data = await res.json()
        setForm(data || {})
      } catch (e) {
        alert("Failed to load school")
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload: any = {
        name: form.name ?? "",
        email: form.email ?? "",
        phone: form.phone ?? "",
        website: form.website ?? "",
        address_line1: form.address_line1 ?? "",
        address_line2: form.address_line2 ?? "",
        city: form.city ?? "",
        state: form.state ?? "",
        country: form.country ?? "",
        postal_code: form.postal_code ?? "",
        principal: form.principal ?? "",
        description: form.description ?? "",
      }
      const res = await fetch(`/api/schools/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to save")
      router.push("/admin/schools")
    } catch (e) {
      console.error(e)
      alert("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit School</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name || ""} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <Label>Principal</Label>
              <Input value={form.principal || ""} onChange={(e) => update("principal", e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email || ""} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone || ""} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Website</Label>
              <Input value={form.website || ""} onChange={(e) => update("website", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Address Line 1</Label>
              <Input value={form.address_line1 || ""} onChange={(e) => update("address_line1", e.target.value)} />
            </div>
            <div>
              <Label>Address Line 2</Label>
              <Input value={form.address_line2 || ""} onChange={(e) => update("address_line2", e.target.value)} />
            </div>
            <div>
              <Label>City</Label>
              <Input value={form.city || ""} onChange={(e) => update("city", e.target.value)} />
            </div>
            <div>
              <Label>State</Label>
              <Input value={form.state || ""} onChange={(e) => update("state", e.target.value)} />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={form.country || ""} onChange={(e) => update("country", e.target.value)} />
            </div>
            <div>
              <Label>Postal Code</Label>
              <Input value={form.postal_code || ""} onChange={(e) => update("postal_code", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Description</Label>
              <Input value={form.description || ""} onChange={(e) => update("description", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {loading && <div className="text-gray-500">Loading...</div>}
      </div>
    </AdminLayout>
  )
}

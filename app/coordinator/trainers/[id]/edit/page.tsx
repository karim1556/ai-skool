"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CoordinatorTrainerEditPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id as string

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialization: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/trainers?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load trainer')
        const data = await res.json()
        const t = Array.isArray(data) ? data[0] : data
        if (!active) return
        setForm({
          first_name: t?.first_name || "",
          last_name: t?.last_name || "",
          email: t?.email || "",
          phone: t?.phone ? String(t.phone) : "",
          specialization: t?.specialization || "",
        })
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load trainer')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [id])

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/trainers?id=${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          specialization: form.specialization,
        })
      })
      if (!res.ok) throw new Error((await res.json().catch(()=>({})))?.error || 'Update failed')
      router.push(`/coordinator/trainers/${id}`)
    } catch (e:any) {
      setError(e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Trainers" Sidebar={CoordinatorSidebar}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Edit Trainer</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
          {loading ? 'Loading...' : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">First name</span>
                <input className="border rounded px-3 py-2" value={form.first_name} onChange={e=>setForm(v=>({ ...v, first_name: e.target.value }))} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Last name</span>
                <input className="border rounded px-3 py-2" value={form.last_name} onChange={e=>setForm(v=>({ ...v, last_name: e.target.value }))} />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm text-muted-foreground">Email</span>
                <input className="border rounded px-3 py-2" value={form.email} onChange={e=>setForm(v=>({ ...v, email: e.target.value }))} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Phone</span>
                <input className="border rounded px-3 py-2" value={form.phone} onChange={e=>setForm(v=>({ ...v, phone: e.target.value }))} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Specialization</span>
                <input className="border rounded px-3 py-2" value={form.specialization} onChange={e=>setForm(v=>({ ...v, specialization: e.target.value }))} />
              </label>
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

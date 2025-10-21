"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { SchoolForm, type SchoolFormValues } from "@/components/admin/schools/school-form"
import { Protect } from "@clerk/nextjs"

export default function EditSchoolPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/schools/${id}`, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load school")
        const j = await res.json()
        setData(j)
      } catch (e: any) {
        alert(e.message || "Failed to load school")
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  const initial = useMemo(() => {
    if (!data) return undefined
    const social = typeof data.social_links === "string" ? (()=>{ try { return JSON.parse(data.social_links) } catch { return {} } })() : (data.social_links || {})
    return {
      name: data.name || "",
      board: data.tagline || "cbse",
      country: data.country || "",
      stateVal: data.state || "",
      district: data.city || "",
      description: data.description || "",
      address: data.address_line1 || "",
      logoFile: null,
      bannerFile: null,
      email: data.email || "",
      phone: data.phone || "",
      contactPerson: data.principal || "",
      website: data.website || "",
      facebook: social.facebook || "",
      instagram: social.instagram || "",
      twitter: social.twitter || "",
      banner_focal_x: typeof data.banner_focal_x === 'number' ? data.banner_focal_x : 50,
      banner_focal_y: typeof data.banner_focal_y === 'number' ? data.banner_focal_y : 50,
    } as Partial<SchoolFormValues>
  }, [data])

  const onSubmit = async (values: SchoolFormValues) => {
    setSaving(true)
    try {
      const social = { facebook: values.facebook, instagram: values.instagram, twitter: values.twitter }
      let res: Response
      if (values.logoFile || values.bannerFile) {
  const fd = new FormData()
  fd.append("name", String(values.name ?? ""))
  fd.append("tagline", String(values.board ?? ""))
  fd.append("description", String(values.description ?? ""))
  fd.append("email", String(values.email ?? ""))
  fd.append("phone", String(values.phone ?? ""))
  fd.append("principal", String(values.contactPerson ?? ""))
  fd.append("address_line1", String(values.address ?? ""))
  fd.append("city", String(values.district ?? ""))
  fd.append("state", String(values.stateVal ?? ""))
  fd.append("country", String(values.country ?? ""))
  fd.append("website", String(values.website ?? ""))
  fd.append("social_links", JSON.stringify(social))
  if (values.logoFile) fd.append("logo", values.logoFile)
  if (values.bannerFile) fd.append("banner", values.bannerFile)
  if (typeof values.banner_focal_x === 'number') fd.append("banner_focal_x", String(values.banner_focal_x))
  if (typeof values.banner_focal_y === 'number') fd.append("banner_focal_y", String(values.banner_focal_y))
        res = await fetch(`/api/schools/${id}`, { method: "PUT", body: fd })
      } else {
        const payload: any = {
          name: values.name,
          tagline: values.board,
          description: values.description,
          email: values.email,
          phone: values.phone,
          principal: values.contactPerson,
          address_line1: values.address,
          city: values.district,
          state: values.stateVal,
          country: values.country,
          website: values.website,
          social_links: JSON.stringify(social),
          banner_focal_x: values.banner_focal_x,
          banner_focal_y: values.banner_focal_y,
        }
        res = await fetch(`/api/schools/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
      if (!res.ok) throw new Error("Failed to save")
      router.push("/admin/schools")
    } catch (e: any) {
      alert(e.message || "Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
    <AdminLayout>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <SchoolForm initial={initial} onSubmit={onSubmit} submitting={saving} submitLabel="Save Changes" />
      )}
    </AdminLayout>
    </Protect>
  )
}

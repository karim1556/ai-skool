"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { SchoolForm, type SchoolFormValues } from "@/components/admin/schools/school-form"

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
    } as Partial<SchoolFormValues>
  }, [data])

  const onSubmit = async (values: SchoolFormValues) => {
    setSaving(true)
    try {
      const social = { facebook: values.facebook, instagram: values.instagram, twitter: values.twitter }
      let res: Response
      if (values.logoFile || values.bannerFile) {
        const fd = new FormData()
        fd.append("name", values.name)
        fd.append("tagline", values.board)
        fd.append("description", values.description)
        fd.append("email", values.email)
        fd.append("phone", values.phone)
        fd.append("principal", values.contactPerson)
        fd.append("address_line1", values.address)
        fd.append("city", values.district)
        fd.append("state", values.stateVal)
        fd.append("website", values.website)
        fd.append("social_links", JSON.stringify(social))
        if (values.logoFile) fd.append("logo", values.logoFile)
        if (values.bannerFile) fd.append("banner", values.bannerFile)
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
          website: values.website,
          social_links: JSON.stringify(social),
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
    <AdminLayout>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <SchoolForm initial={initial} onSubmit={onSubmit} submitting={saving} submitLabel="Save Changes" />
      )}
    </AdminLayout>
  )
}

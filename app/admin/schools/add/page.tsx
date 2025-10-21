"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { SchoolForm, type SchoolFormValues } from "@/components/admin/schools/school-form"
import { Protect } from "@clerk/nextjs"

export default function AddSchoolPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (values: SchoolFormValues) => {
    setSubmitting(true)
    try {
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
      if (values.logoFile) fd.append("logo", values.logoFile)
      if (values.bannerFile) fd.append("banner", values.bannerFile)
      const social = { facebook: values.facebook, instagram: values.instagram, twitter: values.twitter }
      fd.append("social_links", JSON.stringify(social))
  if (typeof values.banner_focal_x === 'number') fd.append("banner_focal_x", String(values.banner_focal_x))
  if (typeof values.banner_focal_y === 'number') fd.append("banner_focal_y", String(values.banner_focal_y))

      const res = await fetch("/api/schools", { method: "POST", body: fd })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Failed to create school")
      }
      router.push("/admin/schools")
    } catch (e: any) {
      alert(e.message || "Failed to create school")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
    <AdminLayout>
      <SchoolForm onSubmit={onSubmit} submitting={submitting} submitLabel="Save School" />
    </AdminLayout>
    </Protect>
  )
}

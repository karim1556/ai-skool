"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Protect } from "@clerk/nextjs"

export default function SchoolOrganizationBindingPage() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [schoolName, setSchoolName] = useState("")
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null)
  const [orgInput, setOrgInput] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/schools/${id}`, { cache: "no-store" })
        const data = await res.json()
        setSchoolName(data?.name || "")
        setCurrentOrgId(data?.clerk_org_id ?? null)
        setOrgInput(data?.clerk_org_id ?? "")
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  const save = async (value: string | null) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/schools/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerk_org_id: value }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || "Failed to save binding")
      }
      const updated = await res.json()
      setCurrentOrgId(updated.clerk_org_id ?? null)
      setOrgInput(updated.clerk_org_id ?? "")
      alert("Binding saved")
    } catch (e: any) {
      alert(e.message || "Failed to save binding")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
      <AdminLayout>
        <div className="text-gray-500 p-4">Loading...</div>
      </AdminLayout>
    </Protect>
  )

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
      <AdminLayout>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bind Clerk Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">School: <span className="font-medium">{schoolName}</span></p>
              <div className="space-y-2">
                <Label htmlFor="orgId">Clerk Organization ID</Label>
                <Input
                  id="orgId"
                  placeholder="org_..."
                  value={orgInput}
                  onChange={(e) => setOrgInput(e.target.value)}
                />
                <p className="text-xs text-gray-500">Paste the Clerk Organization ID to bind. Leave empty and Save to unbind.</p>
              </div>
              <div className="flex gap-2">
                <Button disabled={saving} onClick={() => save(orgInput.trim() === "" ? null : orgInput.trim())}>
                  {saving ? "Saving..." : "Save"}
                </Button>
                {currentOrgId && (
                  <Button variant="outline" disabled={saving} onClick={() => save(null)}>
                    {saving ? "Saving..." : "Unbind"}
                  </Button>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Current: {currentOrgId ? <code>{currentOrgId}</code> : <span className="italic">Not bound</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </Protect>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { Button } from "@/components/ui/button"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useAuth, useOrganization } from "@clerk/nextjs"

export default function CoordinatorTrainersPage() {
  const router = useRouter()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [trainers, setTrainers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reload = async () => {
    try {
      const res = await fetch(`/api/trainers`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load trainers')
      const data = await res.json()
      setTrainers(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load trainers')
    }
  }

  useEffect(() => {
    if (!authLoaded || !orgLoaded) return
    if (!isSignedIn || !organization?.id) return
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }) } catch {}
        const sres = await fetch('/api/me/school', { cache: 'no-store' })
        if (!sres.ok) throw new Error('Failed to resolve school')
        const school = await sres.json()
        const sid = school?.schoolId
        if (!sid) throw new Error('No school linked to this organization')
        if (!active) return
        setSchoolId(sid)
        setSchoolName(school?.name ?? null)

        const res = await fetch(`/api/trainers`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load trainers')
        const data = await res.json()
        if (!active) return
        setTrainers(Array.isArray(data) ? data : [])
      } catch (e: any) {
        if (!active) return
        setError(e?.message || 'Failed to load trainers')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, isSignedIn, organization?.id])

  const schoolDisplay = schoolName && schoolName !== 'Unnamed School' ? schoolName : (organization?.name || (schoolId ?? null))

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Trainers" Sidebar={CoordinatorSidebar}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Trainers</h1>
        <div className="flex gap-2">
          <Link href="/coordinator/trainers/new"><Button>Add Trainer</Button></Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your School Trainers</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : error ? error : schoolDisplay ? `School: ${schoolDisplay}` : "No school linked"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Specialization</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.length === 0 && (
                    <tr><td className="py-3 px-4 text-sm text-muted-foreground" colSpan={6}>No trainers found</td></tr>
                  )}
                  {trainers.map((t, idx) => (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium">{`${t.first_name || ""} ${t.last_name || ""}`.trim() || t.email || t.id}</td>
                      <td className="py-3 px-4">{t.email || "—"}</td>
                      <td className="py-3 px-4">{t.phone ? String(t.phone) : "—"}</td>
                      <td className="py-3 px-4">{t.specialization || "—"}</td>
                      <td className="py-3 px-4 text-right">
                        <ActionDropdown
                          onView={() => router.push(`/coordinator/trainers/${t.id}`)}
                          onEdit={() => router.push(`/coordinator/trainers/${t.id}/edit`)}
                          onDelete={async () => {
                            const ok = confirm('Delete this trainer?')
                            if (!ok) return
                            const res = await fetch(`/api/trainers?id=${encodeURIComponent(t.id)}`, { method: 'DELETE' })
                            if (res.ok) {
                              reload()
                            } else {
                              const j = await res.json().catch(() => ({} as any))
                              alert(j?.error || 'Failed to delete')
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

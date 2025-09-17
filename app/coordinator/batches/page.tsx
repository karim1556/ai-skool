"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { useRouter } from "next/navigation"
import { Protect, useAuth, useOrganization } from "@clerk/nextjs"

export default function CoordinatorBatchesPage() {
  const router = useRouter()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [batches, setBatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

        const res = await fetch(`/api/batches`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load batches')
        const data = await res.json()
        if (!active) return
        setBatches(Array.isArray(data) ? data : [])
      } catch (e: any) {
        if (!active) return
        setError(e?.message || 'Failed to load batches')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [authLoaded, orgLoaded, isSignedIn, organization?.id])

  const schoolDisplay = schoolName && schoolName !== 'Unnamed School' ? schoolName : (organization?.name || (schoolId ?? null))

  return (
    <Protect
    role="schoolcoordinator"
    fallback={<p>Access denied</p>}
    >
    <RoleLayout title="Aiskool LMS" subtitle="Batches" Sidebar={CoordinatorSidebar}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Batches</h1>
        <div className="flex gap-2">
          <Link href="/coordinator/batches/new"><Button>Create Batch</Button></Link>
          <Link href="/coordinator/assign-trainer"><Button variant="secondary">Assign Trainer</Button></Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your School Batches</CardTitle>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Students</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Trainers</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Schedule</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.length === 0 && (
                    <tr><td className="py-3 px-4 text-sm text-muted-foreground" colSpan={5}>No batches found</td></tr>
                  )}
                  {batches.map((b:any) => (
                    <tr key={b.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{b.name}</td>
                      <td className="py-3 px-4">{b.student_count || 0}</td>
                      <td className="py-3 px-4">{b.trainer_count || 0}</td>
                      <td className="py-3 px-4 capitalize">{b.status || 'pending'}</td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-sm text-gray-700 truncate" title={b.schedule || ''}>
                          {b.schedule ? b.schedule : '—'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <ActionDropdown
                          actions={[
                            { label: 'Edit', value: 'edit' },
                            { label: 'Assign Students', value: 'assign' },
                            { label: 'Delete', value: 'delete', variant: 'destructive' },
                          ]}
                          onAction={async (action) => {
                            if (action === 'edit') {
                              router.push(`/coordinator/batches/${b.id}/edit`)
                            } else if (action === 'assign') {
                              router.push(`/coordinator/batches/${b.id}/assign`)
                            } else if (action === 'delete') {
                              const ok = confirm('Delete this batch?')
                              if (!ok) return
                              const res = await fetch(`/api/batches?id=${encodeURIComponent(b.id)}`, { method: 'DELETE' })
                              if (res.ok) {
                                setBatches((prev)=>prev.filter((x:any)=>x.id!==b.id))
                              } else {
                                const j = await res.json().catch(()=>({} as any))
                                alert(j?.error || 'Failed to delete')
                              }
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
    </Protect>
  )
}

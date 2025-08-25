"use client"

import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Protect, useOrganization } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CoordinatorSchoolsPage() {
  const { organization } = useOrganization()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [school, setSchool] = useState<{ id: string; name?: string | null } | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/me/school', { cache: 'no-store' })
        if (!res.ok) throw new Error('No school linked to this organization')
        const data = await res.json()
        if (!active) return
        setSchool({ id: data?.schoolId, name: data?.name ?? null })
      } catch (e: any) {
        if (!active) return
        setError(e?.message || 'Failed to load school')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  return (
    <Protect role="schoolcoordinator" fallback={<p>Access denied</p>}>
      <RoleLayout title="Aiskool LMS" subtitle="Schools" Sidebar={CoordinatorSidebar}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Schools</h1>
          <div />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your School</CardTitle>
            <CardDescription>
              {loading ? 'Loading...' : error ? error : school ? ((school.name && school.name !== 'Unnamed School') ? school.name : (organization?.name || school.id)) : 'No school linked'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!loading && !error && school && (
              <div className="text-sm text-muted-foreground">
                This is the school linked to your active organization. Manage trainers, students, and batches scoped to this school.
              </div>
            )}
          </CardContent>
        </Card>
      </RoleLayout>
    </Protect>
  )
}

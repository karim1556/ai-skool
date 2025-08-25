"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { OrganizationSwitcher, useAuth, useOrganization, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TrainerAssignmentsPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])

  useEffect(() => {
    if (!authLoaded || !orgLoaded || !userLoaded) return
    if (!isSignedIn || !organization?.id) return
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }) } catch {}
        const schoolRes = await fetch('/api/me/school', { cache: 'no-store' })
        const [trainersRes] = await Promise.all([
          fetch('/api/trainers', { cache: 'no-store' })
        ])
        const sch = schoolRes.ok ? await schoolRes.json() : null
        const tjs = trainersRes.ok ? await trainersRes.json() : []
        const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
        const me = (tjs || []).find((t:any) => (t.email || '').toLowerCase() === email)
        const aRes = await fetch(`/api/assignments?trainerId=${me?.id || ''}`, { cache: 'no-store' })
        const ajs = await aRes.json()
        if (!aRes.ok) throw new Error(ajs?.error || 'Failed to fetch assignments')
        if (!active) return
        setSchoolName(sch?.name ?? null)
        setTrainers(tjs || [])
        setAssignments(ajs || [])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load context')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, userLoaded, isSignedIn, organization?.id])

  if (!authLoaded || !orgLoaded || !userLoaded) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Assignments" Sidebar={TrainerSidebar}>
        <div className="p-6">Loading...</div>
      </RoleLayout>
    )
  }
  if (!isSignedIn) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Assignments" Sidebar={TrainerSidebar}>
        <div className="p-6">Please sign in to continue.</div>
      </RoleLayout>
    )
  }
  if (!organization) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Assignments" Sidebar={TrainerSidebar}>
        <div className="p-6">
          <p className="mb-3">Please select an organization to continue.</p>
          <OrganizationSwitcher />
        </div>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Trainer Assignments" Sidebar={TrainerSidebar}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Assignments</h2>
        <Button asChild><Link href="/trainer/assignments/new">New Assignment</Link></Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Assignments</CardTitle>
          <CardDescription>
            {loading ? 'Loading...' : error ? error : (schoolName ? `School: ${schoolName}` : '')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? 'Loading...' : error ? <div className="text-destructive">{error}</div> : (
            <div className="divide-y">
              {assignments.length === 0 && <div className="text-sm text-muted-foreground">No assignments yet.</div>}
              {assignments.map((a:any) => (
                <div key={a.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.title || 'Untitled Assignment'}</div>
                    <div className="text-sm text-muted-foreground">Due: {a.due_date || '—'}</div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/trainer/grade?assignmentId=${a.id}`}>Grade</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

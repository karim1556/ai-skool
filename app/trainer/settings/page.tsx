"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OrganizationSwitcher, useAuth, useOrganization, useUser } from "@clerk/nextjs"

export default function TrainerSettingsPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)

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
        if (schoolRes.ok) {
          const sch = await schoolRes.json()
          if (!active) return
          setSchoolName(sch?.name ?? null)
        }
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
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Settings" Sidebar={TrainerSidebar}>
        <div className="p-6">Loading...</div>
      </RoleLayout>
    )
  }
  if (!isSignedIn) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Settings" Sidebar={TrainerSidebar}>
        <div className="p-6">Please sign in to continue.</div>
      </RoleLayout>
    )
  }
  if (!organization) {
    return (
      <RoleLayout title="Aiskool LMS" subtitle="Trainer Settings" Sidebar={TrainerSidebar}>
        <div className="p-6">
          <p className="mb-3">Please select an organization to continue.</p>
          <OrganizationSwitcher />
        </div>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Trainer Settings" Sidebar={TrainerSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            {loading ? 'Loading...' : error ? error : (schoolName ? `School: ${schoolName}` : '')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 max-w-lg">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={user?.fullName || ''} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.primaryEmailAddress?.emailAddress || ''} readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Organization</Label>
              <div className="rounded-md border p-2 bg-muted/50">
                <OrganizationSwitcher />
              </div>
            </div>
            <div>
              <Button disabled>Save</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

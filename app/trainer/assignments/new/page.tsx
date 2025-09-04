"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth, useOrganization, useUser } from "@clerk/nextjs"

export default function NewAssignmentPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [batchId, setBatchId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [instructions, setInstructions] = useState("")

  const [batches, setBatches] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!authLoaded || !orgLoaded || !userLoaded || !isSignedIn || !organization?.id) return
      setError(null)
      try {
        await fetch('/api/sync/me', { method: 'POST' })
        const schoolRes = await fetch('/api/me/school'); const school = await schoolRes.json()
        if (!school?.schoolId) throw new Error('No school context')
        const [bRes, tRes] = await Promise.all([
          fetch(`/api/batches?schoolId=${school.schoolId}`),
          fetch(`/api/trainers?schoolId=${school.schoolId}`)
        ])
        const [bjs, tjs] = await Promise.all([bRes.json(), tRes.json()])
        if (!active) return
        setBatches(bjs || [])
        setTrainers(tjs || [])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load form data')
      }
    })()
    return () => { active = false }
  }, [authLoaded, orgLoaded, userLoaded, isSignedIn, organization?.id])

  const myTrainer = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
    if (!email) return null
    return trainers.find((t:any) => (t.email || '').toLowerCase() === email) || null
  }, [trainers, user?.primaryEmailAddress?.emailAddress])

  // Wire to POST /api/assignments endpoint
  const onCreate = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!batchId || !myTrainer?.id) throw new Error('Select batch; trainer not identified')
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch_id: batchId,
          trainer_id: myTrainer.id,
          title,
          instructions,
          due_date: dueDate || null,
        })
      })
      const js = await res.json()
      if (!res.ok) throw new Error(js?.error || 'Failed to post assignment')
      alert('Assignment posted')
    } catch (e:any) {
      setError(e?.message || 'Failed to post assignment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Post Assignment" Sidebar={TrainerSidebar}>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Assignment Creation Disabled</CardTitle>
          <CardDescription>
            Assignment creation is restricted to coordinators. Trainers can view assignments and grade submissions only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            If you need a new assignment, please contact your coordinator to create it.
          </div>
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

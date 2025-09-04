"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CoordinatorTrainerViewPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id as string
  const [trainer, setTrainer] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/trainers?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load trainer')
        const data = await res.json()
        if (!active) return
        setTrainer(Array.isArray(data) ? data[0] : data)
      } catch (e: any) {
        if (!active) return
        setError(e?.message || 'Failed to load trainer')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [id])

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Trainers" Sidebar={CoordinatorSidebar}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Trainer Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
          {id && <Link href={`/coordinator/trainers/${id}/edit`}><Button>Edit</Button></Link>}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{trainer ? (`${trainer.first_name || ''} ${trainer.last_name || ''}`.trim() || trainer.email || 'Trainer') : 'Trainer'}</CardTitle>
          <CardDescription>{loading ? 'Loading...' : error ? error : trainer?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && !error && trainer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">First name:</span> {trainer.first_name || '—'}</div>
              <div><span className="text-muted-foreground">Last name:</span> {trainer.last_name || '—'}</div>
              <div><span className="text-muted-foreground">Email:</span> {trainer.email || '—'}</div>
              <div><span className="text-muted-foreground">Phone:</span> {trainer.phone ? String(trainer.phone) : '—'}</div>
              <div className="md:col-span-2"><span className="text-muted-foreground">Specialization:</span> {trainer.specialization || '—'}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

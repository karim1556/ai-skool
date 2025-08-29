"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useAuth, useUser } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"

export default function StudentAssignedLevelsPage() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [levels, setLevels] = useState<any[]>([])
  const [q, setQ] = useState("")

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!authLoaded || !userLoaded) return
      if (!isSignedIn) return
      setLoading(true)
      setError(null)
      try {
        // resolve enrolments of current student via clerk id
        const clerkId = user?.id
        const enrRes = await fetch(`/api/batch-enrolments?studentClerkId=${encodeURIComponent(clerkId || '')}`, { cache: 'no-store' })
        const enrolments = await enrRes.json()
        if (!enrRes.ok) throw new Error(enrolments?.error || 'Failed to load enrolments')
        const batchIds: string[] = Array.isArray(enrolments) ? [...new Set(enrolments.map((e:any)=> e.batch_id).filter(Boolean))] : []
        // fetch levels for each batch
        const results: any[] = []
        for (const bid of batchIds) {
          const res = await fetch(`/api/batches/${bid}/levels`, { cache: 'no-store' })
          const js = await res.json()
          if (res.ok && Array.isArray(js)) results.push(...js)
        }
        // dedupe by level id
        const map = new Map<number, any>()
        for (const l of results) { if (!map.has(l.id)) map.set(l.id, l) }
        if (!active) return
        setLevels(Array.from(map.values()))
      } catch (e:any) {
        if (active) setError(e?.message || 'Failed to load levels')
      } finally { if (active) setLoading(false) }
    })()
    return () => { active = false }
  }, [authLoaded, userLoaded, isSignedIn, user?.id])

  const filtered = useMemo(() => {
    if (!q.trim()) return levels
    const qq = q.toLowerCase()
    return levels.filter((l:any) => `${l.name} ${l.subtitle} ${l.category}`.toLowerCase().includes(qq))
  }, [levels, q])

  return (
    <RoleLayout title="Aiskool LMS" subtitle="My Levels" Sidebar={StudentSidebar}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Levels for Your Batch</CardTitle>
            <CardDescription>Coordinators assign levels to your batch. Explore courses inside each level.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="text-sm text-destructive mb-2">{error}</div>}
            <div className="mb-4 max-w-sm"><Input placeholder="Search levels" value={q} onChange={(e)=>setQ(e.target.value)} /></div>
            {loading ? 'Loading...' : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((l:any) => (
                  <Link key={l.id} href={`/student/levels/${l.id}`} className="block">
                    <div className="border rounded-lg overflow-hidden hover:shadow-sm transition">
                      <Image src={l.thumbnail || '/placeholder.svg'} alt={l.name} width={640} height={360} className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <div className="font-semibold truncate">{l.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{l.subtitle || l.category}</div>
                      </div>
                    </div>
                  </Link>
                ))}
                {filtered.length === 0 && <div className="text-sm text-muted-foreground">No levels assigned to your batch yet.</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}

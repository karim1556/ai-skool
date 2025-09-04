"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function CoordinatorAssignStudentsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [batchName, setBatchName] = useState<string>("")
  const [students, setStudents] = useState<Array<{ id: string; first_name?: string; last_name?: string }>>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!id) return
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const [batchRes, studentsRes] = await Promise.all([
          fetch(`/api/batches?id=${encodeURIComponent(id)}`, { cache: 'no-store' }),
          fetch(`/api/students`, { cache: 'no-store' }),
        ])
        if (!batchRes.ok) throw new Error('Failed to load batch')
        const [batch, std] = await Promise.all([batchRes.json(), studentsRes.json()])
        const b = Array.isArray(batch) ? batch[0] : batch
        if (!b?.id) throw new Error('Batch not found')
        if (!active) return
        setBatchName(b.name || '')
        setStudents(Array.isArray(std) ? std : [])
        const init = new Set<string>((b.student_ids ? String(b.student_ids).split(',') : []).filter(Boolean))
        setSelected(init)
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [id])

  const toggle = (sid: string, v: boolean | string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (v) next.add(sid)
      else next.delete(sid)
      return next
    })
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/batches?id=${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIds: Array.from(selected) })
      })
      if (!res.ok) throw new Error((await res.json().catch(()=>({})))?.error || 'Failed to save')
      router.push('/coordinator/batches')
    } catch (e:any) {
      setError(e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <RoleLayout title="Coordinator" subtitle="Assign Students" Sidebar={CoordinatorSidebar}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Assign Students</h1>
          <p className="text-sm text-muted-foreground">Batch: {batchName || id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>Select or unselect students to assign to this batch.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? 'Loading...' : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {students.length === 0 && (
                <div className="text-sm text-muted-foreground">No students found</div>
              )}
              {students.map((s) => {
                const sid = s.id
                const label = `${s.first_name ?? ''} ${s.last_name ?? ''}`.trim() || sid
                const checked = selected.has(sid)
                return (
                  <label key={sid} className="flex items-center gap-2 rounded border p-2">
                    <Checkbox checked={checked} onCheckedChange={(v)=>toggle(sid, v)} />
                    <span className="text-sm">{label}</span>
                  </label>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}

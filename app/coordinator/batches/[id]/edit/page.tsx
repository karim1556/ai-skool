"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export default function CoordinatorEditBatchPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState("")
  const [courseId, setCourseId] = useState<string>("")
  const [status, setStatus] = useState<string>("pending")
  const [maxStudents, setMaxStudents] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [schedule, setSchedule] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([])
  const [trainers, setTrainers] = useState<Array<{ id: string; first_name?: string; last_name?: string }>>([])
  const [students, setStudents] = useState<Array<{ id: string; first_name?: string; last_name?: string }>>([])

  const [selectedTrainerIds, setSelectedTrainerIds] = useState<Set<string>>(new Set())
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!id) return
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const [batchRes, coursesRes, trainersRes, studentsRes] = await Promise.all([
          fetch(`/api/batches?id=${encodeURIComponent(id)}`, { cache: 'no-store' }),
          fetch(`/api/courses`, { cache: 'no-store' }),
          fetch(`/api/trainers`, { cache: 'no-store' }),
          fetch(`/api/students`, { cache: 'no-store' }),
        ])
        if (!batchRes.ok) throw new Error('Failed to load batch')
        const [batch, crs, trs, std] = await Promise.all([
          batchRes.json(), coursesRes.json(), trainersRes.json(), studentsRes.json()
        ])
        const b = Array.isArray(batch) ? batch[0] : batch
        if (!b?.id) throw new Error('Batch not found')
        if (!active) return
        setName(b.name || "")
        setCourseId(b.course_id || "")
        setStatus(b.status || 'pending')
        setMaxStudents(b.max_students ? String(b.max_students) : "")
        setStartDate(b.start_date || "")
        setEndDate(b.end_date || "")
        setSchedule(b.schedule || "")
        setDescription(b.description || "")

        setCourses(Array.isArray(crs) ? crs : [])
        setTrainers(Array.isArray(trs) ? trs : [])
        setStudents(Array.isArray(std) ? std : [])

        const initTrainerIds = new Set<string>((b.trainer_ids ? String(b.trainer_ids).split(',') : []).filter(Boolean))
        const initStudentIds = new Set<string>((b.student_ids ? String(b.student_ids).split(',') : []).filter(Boolean))
        setSelectedTrainerIds(initTrainerIds)
        setSelectedStudentIds(initStudentIds)
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [id])

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/batches?id=${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          course_id: courseId || null,
          status,
          max_students: maxStudents || null,
          start_date: startDate || null,
          end_date: endDate || null,
          schedule,
          description,
          trainerIds: Array.from(selectedTrainerIds),
          studentIds: Array.from(selectedStudentIds),
        })
      })
      if (!res.ok) throw new Error((await res.json().catch(()=>({})))?.error || 'Failed to save')
      router.push('/coordinator/batches')
    } catch (e:any) {
      setError(e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const toggle = (set: React.Dispatch<React.SetStateAction<Set<string>>>, id: string, v: boolean | string) => {
    set(prev => {
      const next = new Set(prev)
      if (v) next.add(id)
      else next.delete(id)
      return next
    })
  }

  return (
    <RoleLayout title="Coordinator" subtitle="Edit Batch" Sidebar={CoordinatorSidebar}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Edit Batch</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? 'Loading...' : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Name</span>
                <Input value={name} onChange={(e)=>setName(e.target.value)} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Course</span>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Status</span>
                <RadioGroup value={status} onValueChange={setStatus} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="verified" id="verified" />
                    <Label htmlFor="verified">Verified</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unverified" id="unverified" />
                    <Label htmlFor="unverified">Unverified</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pending" id="pending" />
                    <Label htmlFor="pending">Pending</Label>
                  </div>
                </RadioGroup>
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Max Students</span>
                <Input type="number" value={maxStudents} onChange={(e)=>setMaxStudents(e.target.value)} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <Input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-muted-foreground">End Date</span>
                <Input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm text-muted-foreground">Schedule</span>
                <Input value={schedule} onChange={(e)=>setSchedule(e.target.value)} />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm text-muted-foreground">Description</span>
                <Input value={description} onChange={(e)=>setDescription(e.target.value)} />
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Assign Trainers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? 'Loading...' : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {trainers.map((t) => {
                  const tid = t.id
                  const label = `${t.first_name ?? ''} ${t.last_name ?? ''}`.trim() || tid
                  const checked = selectedTrainerIds.has(tid)
                  return (
                    <label key={tid} className="flex items-center gap-2 rounded border p-2">
                      <Checkbox checked={checked} onCheckedChange={(v)=>toggle(setSelectedTrainerIds, tid, v)} />
                      <span className="text-sm">{label}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assign Students</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? 'Loading...' : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {students.map((s) => {
                  const sid = s.id
                  const label = `${s.first_name ?? ''} ${s.last_name ?? ''}`.trim() || sid
                  const checked = selectedStudentIds.has(sid)
                  return (
                    <label key={sid} className="flex items-center gap-2 rounded border p-2">
                      <Checkbox checked={checked} onCheckedChange={(v)=>toggle(setSelectedStudentIds, sid, v)} />
                      <span className="text-sm">{label}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}

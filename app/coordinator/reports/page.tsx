"use client"

import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { Protect } from "@clerk/nextjs"
import { useEffect, useMemo, useState } from "react"
import { StatCard } from "@/components/dashboard/StatCard"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader } from "@/components/ui/loader"

type Course = { id: string; title: string }
type Batch = { id: string; name: string }
type Trainer = { id: string; first_name?: string | null; last_name?: string | null; email?: string | null }

export default function CoordinatorReportsPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [courseId, setCourseId] = useState<string>("")
  const [batchId, setBatchId] = useState<string>("")
  const [trainerId, setTrainerId] = useState<string>("")
  const [mode, setMode] = useState<'batch' | 'trainer'>('batch')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<any | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [cRes, bRes, tRes] = await Promise.all([
          fetch('/api/courses', { cache: 'no-store' }),
          fetch('/api/batches', { cache: 'no-store' }).catch(()=>null),
          fetch('/api/trainers', { cache: 'no-store' }).catch(()=>null),
        ])
        const cJson = cRes.ok ? await cRes.json() : []
        const bJson = bRes && bRes.ok ? await bRes.json() : []
        const tJson = tRes && tRes.ok ? await tRes.json() : []
        if (!active) return
        setCourses(Array.isArray(cJson) ? cJson : [])
        setBatches(Array.isArray(bJson) ? bJson : [])
        setTrainers(Array.isArray(tJson) ? tJson : [])
      } catch {}
    })()
    return ()=>{ active=false }
  }, [])

  useEffect(() => {
    if (!courseId) { setSummary(null); return }
    if (mode === 'batch' && !batchId) { setSummary(null); return }
    if (mode === 'trainer' && !trainerId) { setSummary(null); return }
    let active = true
    setLoading(true)
    const url = mode === 'batch'
      ? `/api/progress/summary?courseId=${encodeURIComponent(courseId)}&batchId=${encodeURIComponent(batchId)}`
      : `/api/progress/summary?courseId=${encodeURIComponent(courseId)}&trainerId=${encodeURIComponent(trainerId)}`
    fetch(url, { cache: 'no-store' })
      .then(r=> r.json())
      .then(j=> { if (active) setSummary(j) })
      .finally(()=> { if (active) setLoading(false) })
    return ()=>{ active=false }
  }, [courseId, batchId, trainerId, mode])

  const perStudent = useMemo(()=> Array.isArray(summary?.perStudent) ? summary.perStudent : [], [summary])

  return (
    <Protect role="schoolcoordinator" fallback={<p>Access denied</p>}>
      <RoleLayout title="Aiskool LMS" subtitle="Reports" Sidebar={CoordinatorSidebar}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <label className="text-xs text-muted-foreground">Mode</label>
                <Select value={mode} onValueChange={(v:any)=>{ setMode(v); setSummary(null) }}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="batch">Batch</SelectItem>
                    <SelectItem value="trainer">Trainer</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <label className="text-xs text-muted-foreground">Course</label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            {mode === 'batch' ? (
              <Card>
                <CardContent className="p-4">
                  <label className="text-xs text-muted-foreground">Batch</label>
                  <Select value={batchId} onValueChange={setBatchId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map(b => (
                        <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <label className="text-xs text-muted-foreground">Trainer</label>
                  <Select value={trainerId} onValueChange={setTrainerId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map(t => {
                        const name = [t.first_name, t.last_name].filter(Boolean).join(' ') || t.email || t.id
                        return (
                          <SelectItem key={t.id} value={String(t.id)}>{name}</SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8"><Loader /></div>
          ) : summary && !summary.error ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {mode === 'batch' ? (
                  <>
                    <StatCard label="Lessons Avg %" value={`${Math.round(summary.lessons?.avgCompletedPercent ?? 0)}%`} hint={`${summary.lessons?.total ?? 0} total`} />
                    <StatCard label="Sections Avg %" value={`${Math.round(summary.sections?.avgCompletedPercent ?? 0)}%`} hint={`${summary.sections?.total ?? 0} total`} />
                    <StatCard label="Quizzes Avg %" value={`${Math.round(summary.quizzes?.avgScorePercent ?? 0)}%`} hint={`${summary.quizzes?.total ?? 0} total`} />
                    <StatCard label="Course Avg %" value={`${Math.round(summary.coursePercent ?? 0)}%`} />
                  </>
                ) : (
                  <>
                    <StatCard label="Lessons %" value={`${Math.round(summary.lessons?.percent ?? 0)}%`} hint={`${summary.lessons?.total ?? 0} total`} />
                    <StatCard label="Sections %" value={`${Math.round(summary.sections?.percent ?? 0)}%`} hint={`${summary.sections?.total ?? 0} total`} />
                    <StatCard label="Quizzes Avg %" value={`${Math.round(summary.quizzes?.avgScorePercent ?? 0)}%`} hint={`${summary.quizzes?.total ?? 0} total`} />
                    <StatCard label="Course %" value={`${Math.round(summary.coursePercent ?? 0)}%`} />
                  </>
                )}
              </div>

              {mode === 'batch' && (
                <Card className="mt-4">
                  <CardContent className="p-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-600">
                          <th className="py-2 pr-4">Student ID</th>
                          <th className="py-2 pr-4">Lessons %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {perStudent.map((s:any) => (
                          <tr key={s.student_id} className="border-t">
                            <td className="py-2 pr-4">{s.student_id}</td>
                            <td className="py-2 pr-4">{Math.round(s.percent)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Select a course and {mode === 'batch' ? 'batch' : 'trainer'} to view progress.</p>
          )}
        </div>
      </RoleLayout>
    </Protect>
  )
}

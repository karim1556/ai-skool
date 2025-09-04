"use client"

import { useEffect, useMemo, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useAuth, useOrganization, useUser } from "@clerk/nextjs"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts"

export default function TrainerProgressPage() {
  const { isSignedIn } = useAuth()
  const { organization } = useOrganization()
  const { user } = useUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [trainers, setTrainers] = useState<any[]>([])

  const me = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
    if (!email) return null
    return trainers.find((t:any)=> (t.email||'').toLowerCase() === email) || null
  }, [trainers, user?.primaryEmailAddress?.emailAddress])

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!isSignedIn || !organization?.id) return
      setLoading(true); setError(null)
      try {
        await fetch('/api/sync/me', { method: 'POST' })
        const tRes = await fetch('/api/trainers')
        const tJs = await tRes.json()
        if (!tRes.ok) throw new Error(tJs?.error || 'Failed to load trainers')
        const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
        const me = (tJs||[]).find((t:any)=> (t.email||'').toLowerCase()===email)
        const aRes = await fetch(me?.id ? `/api/assignments?trainerId=${me.id}` : '/api/assignments')
        const aJs = await aRes.json()
        if (!aRes.ok) throw new Error(aJs?.error || 'Failed to load assignments')
        const sRes = await fetch(me?.id ? `/api/submissions?trainerId=${me.id}` : '/api/submissions')
        const sJs = await sRes.json()
        if (!sRes.ok) throw new Error(sJs?.error || 'Failed to load submissions')
        if (!active) return
        setTrainers(tJs||[])
        setAssignments(aJs||[])
        setSubmissions(sJs||[])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load data')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [isSignedIn, organization?.id, user?.primaryEmailAddress?.emailAddress])

  const summary = useMemo(() => {
    const byMonth: Record<string, { month:string, assignments:number, submissions:number, graded:number }>= {}
    const mkey = (d: string) => {
      const dt = new Date(d)
      if (isNaN(+dt)) return 'Unknown'
      return dt.toLocaleString(undefined, { month: 'short', year: 'numeric' })
    }
    for (const a of assignments) {
      const k = mkey(a.created_at || a.due_date || new Date().toISOString())
      byMonth[k] ||= { month: k, assignments: 0, submissions: 0, graded: 0 }
      byMonth[k].assignments++
    }
    for (const s of submissions) {
      const k = mkey(s.submitted_at || new Date().toISOString())
      byMonth[k] ||= { month: k, assignments: 0, submissions: 0, graded: 0 }
      byMonth[k].submissions++
      if (s.grade !== null && s.grade !== undefined) byMonth[k].graded++
    }
    const data = Object.values(byMonth)
    const totalAssignments = assignments.length
    const totalSubmissions = submissions.length
    const graded = submissions.filter(s=> s.grade !== null && s.grade !== undefined).length
    const avgGrade = graded ? Math.round(submissions.filter(s=> s.grade!==null && s.grade!==undefined).reduce((acc:any, s:any)=> acc + Number(s.grade||0), 0)/graded) : null
    return { data, totalAssignments, totalSubmissions, graded, avgGrade }
  }, [assignments, submissions])

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Trainer Progress" Sidebar={TrainerSidebar}>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Your assignments and grading activity</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? 'Loading...' : error ? <div className="text-destructive">{error}</div> : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><div className="text-muted-foreground">Assignments</div><div className="text-2xl font-semibold">{summary.totalAssignments}</div></div>
                <div><div className="text-muted-foreground">Submissions</div><div className="text-2xl font-semibold">{summary.totalSubmissions}</div></div>
                <div><div className="text-muted-foreground">Graded</div><div className="text-2xl font-semibold">{summary.graded}</div></div>
                <div><div className="text-muted-foreground">Avg Grade</div><div className="text-2xl font-semibold">{summary.avgGrade ?? '-'}</div></div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity by Month</CardTitle>
            <CardDescription>Assignments vs Submissions vs Graded</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {loading ? 'Loading...' : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="assignments" fill="#6366F1" name="Assignments" />
                  <Bar dataKey="submissions" fill="#22C55E" name="Submissions" />
                  <Bar dataKey="graded" fill="#F59E0B" name="Graded" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Grades Over Time</CardTitle>
            <CardDescription>Average grade trend (weekly buckets)</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? 'Loading...' : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={computeWeeklyGrades(submissions)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avg" stroke="#10B981" name="Avg Grade" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}

function computeWeeklyGrades(submissions:any[]) {
  const buckets: Record<string, { week:string, sum:number, cnt:number }> = {}
  const getWeek = (d:string) => {
    const dt = new Date(d)
    if (isNaN(+dt)) return 'Unknown'
    const onejan = new Date(dt.getFullYear(), 0, 1)
    const week = Math.ceil((((dt as any) - (onejan as any)) / 86400000 + onejan.getDay() + 1) / 7)
    return `${dt.getFullYear()}-W${week}`
  }
  for (const s of submissions) {
    if (s.grade === null || s.grade === undefined) continue
    const k = getWeek(s.submitted_at || new Date().toISOString())
    buckets[k] ||= { week: k, sum: 0, cnt: 0 }
    buckets[k].sum += Number(s.grade || 0)
    buckets[k].cnt += 1
  }
  return Object.values(buckets).map(b => ({ week: b.week, avg: Math.round(b.sum / b.cnt) }))
}

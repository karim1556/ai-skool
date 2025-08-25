"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video } from "lucide-react"
import { useAuth } from "@clerk/nextjs"

export default function StudentSessionsPage() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const [liveSessions, setLiveSessions] = useState<any[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [joined, setJoined] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return
    ;(async () => {
      try {
        await fetch('/api/sync/me', { method: 'POST' })
        const enrRes = await fetch(`/api/batch-enrolments?studentClerkId=${userId}`)
        const enr = await enrRes.json()
        const enrArr = Array.isArray(enr) ? enr : []
        setEnrollments(enrArr)
        const batchIds = enrArr.map((e:any)=>e.batch_id)
        const liveLists = await Promise.all(batchIds.map((id:string)=>fetch(`/api/sessions?batchId=${id}&activeOnly=true`).then(r=>r.json())))
        const upcomingLists = await Promise.all(batchIds.map((id:string)=>fetch(`/api/sessions?batchId=${id}&upcomingOnly=true`).then(r=>r.json())))
        const live = liveLists.flat()
        setLiveSessions(live)
        setUpcomingSessions(upcomingLists.flat())
        // load joined flags
        const j = new Set<string>()
        await Promise.all(live.map(async (s:any)=>{
          const res = await fetch(`/api/session-attendance?sessionId=${s.id}`)
          const js = await res.json()
          if (res.ok) {
            const me = (js||[]).find((row:any)=>row.student_id===userId)
            if (me?.present) j.add(s.id)
          }
        }))
        setJoined(j)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [isLoaded, isSignedIn, userId])

  const joinMeeting = async (session:any) => {
    try {
      await fetch('/api/session-attendance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: session.id, student_id: userId, present: true })
      })
      if (session.meeting_url) window.open(session.meeting_url, '_blank')
    } catch (e) {
      console.error(e)
      alert('Failed to join')
    }
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Sessions" Sidebar={StudentSidebar}>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Video className="h-5 w-5"/> Live Sessions</CardTitle>
            <CardDescription>Currently active sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {liveSessions.length===0 ? (
              <p className="text-sm text-muted-foreground">No live sessions</p>
            ) : (
              <div className="divide-y">
                {liveSessions.map((s:any)=>(
                  <div key={s.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{s.title || 'Session'}</div>
                      <div className="text-sm text-muted-foreground">{s.starts_at} — {s.ends_at}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {joined.has(s.id) ? <Badge variant="secondary">Joined</Badge> : <Badge variant="outline">Not joined</Badge>}
                      <Button size="sm" onClick={()=>joinMeeting(s)}>Join</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Plan ahead for upcoming sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length===0 ? (
              <p className="text-sm text-muted-foreground">No upcoming sessions</p>
            ) : (
              <div className="space-y-2">
                {upcomingSessions.map((s:any)=>(
                  <div key={s.id} className="text-sm"><span className="font-medium">{s.title || 'Session'}</span> — {s.starts_at}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  )
}

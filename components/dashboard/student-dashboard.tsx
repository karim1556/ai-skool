"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Calendar, Trophy, LogIn, Video, Megaphone } from "lucide-react"

interface StudentDashboardProps {
  userId: string
}

export function StudentDashboard({ userId }: StudentDashboardProps) {
  const [enrolledBatches, setEnrolledBatches] = useState<any[]>([])
  const [availableCourses, setAvailableCourses] = useState<any[]>([])
  const [sessionCode, setSessionCode] = useState("")
  const [joinSessionOpen, setJoinSessionOpen] = useState(false)
  const [liveSessions, setLiveSessions] = useState<any[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [joinedSessionIds, setJoinedSessionIds] = useState<Set<string>>(new Set())

  // Temporary: show all student sections by default (migrated from mock-privileges)
  const privileges = new Set<string>(["join_session", "view_own_progress"]) 

  useEffect(() => {
    fetchStudentData()
  }, [userId])

  const fetchStudentData = async () => {
    try {
      // Fetch enrolled batches via internal API
      const enrRes = await fetch(`/api/batch-enrolments?studentClerkId=${userId}`)
      const enrollments = await enrRes.json()
      const enrArray = Array.isArray(enrollments) ? enrollments : []
      setEnrolledBatches(enrArray)

      // Fetch live and upcoming sessions for all batches
      const batchIds: string[] = enrArray.map((e: any) => e.batch_id)
      const liveLists = await Promise.all(batchIds.map((id) => fetch(`/api/sessions?batchId=${id}&activeOnly=true`).then(r => r.json())))
      const upcomingLists = await Promise.all(batchIds.map((id) => fetch(`/api/sessions?batchId=${id}&upcomingOnly=true`).then(r => r.json())))
      const live = liveLists.flat()
      setLiveSessions(live)
      setUpcomingSessions(upcomingLists.flat())

      // Derive joined sessions for current user
      try {
        const joined = new Set<string>()
        await Promise.all(
          live.map(async (s:any) => {
            const res = await fetch(`/api/session-attendance?sessionId=${s.id}`)
            const js = await res.json()
            if (res.ok) {
              const me = (js || []).find((row:any) => row.student_id === userId)
              if (me?.present) joined.add(s.id)
            }
          })
        )
        setJoinedSessionIds(joined)
      } catch (e) {
        console.error('Failed to load attendance statuses', e)
      }

      // Fetch announcements per batch
      const annLists = await Promise.all(batchIds.map((id) => fetch(`/api/announcements?batchId=${id}`).then(r => r.json())))
      setAnnouncements(annLists.flat())
    } catch (error) {
      console.error("Error fetching student data:", error)
    }
  }

  // Record attendance and open meeting link for a specific session
  const joinMeeting = async (session: any) => {
    try {
      await fetch('/api/session-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: session.id, student_id: userId, present: true })
      })
      if (session.meeting_url) {
        window.open(session.meeting_url, '_blank')
      }
      // refresh lists
      fetchStudentData()
    } catch (error) {
      console.error('Failed to join meeting', error)
      alert('Failed to join meeting')
    }
  }

  // Optional: session code flow (disabled until backend supports codes)
  const joinSession = async () => {
    if (!sessionCode.trim()) return
    alert('Joining by code is not available yet. Please use the Join button on a live session.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Your learning journey</p>
        </div>

        {privileges.has("join_session") && (
          <Dialog open={joinSessionOpen} onOpenChange={setJoinSessionOpen}>
            <DialogTrigger asChild>
              <Button>
                <LogIn className="h-4 w-4 mr-2" />
                Join Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Session</DialogTitle>
                <DialogDescription>Enter the session code provided by your trainer</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter session code"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value)}
                  className="text-center font-mono text-lg"
                />
                <Button onClick={joinSession} className="w-full">
                  Join Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

      {/* Live Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" /> Live Sessions
          </CardTitle>
          <CardDescription>Join sessions that are currently active</CardDescription>
        </CardHeader>
        <CardContent>
          {liveSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No live sessions</p>
          ) : (
            <div className="divide-y">
              {liveSessions.map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{s.title || 'Session'}</div>
                    <div className="text-sm text-muted-foreground">Starts: {s.starts_at || ''} • Ends: {s.ends_at || ''}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {joinedSessionIds.has(s.id) ? (
                      <Badge variant="secondary">Joined</Badge>
                    ) : (
                      <Badge variant="outline">Not joined</Badge>
                    )}
                    <Button size="sm" onClick={() => joinMeeting(s)}>Join</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Upcoming Sessions
          </CardTitle>
          <CardDescription>Scheduled sessions you can plan for</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming sessions</p>
          ) : (
            <div className="space-y-2">
              {upcomingSessions.map((s) => (
                <div key={s.id} className="text-sm">
                  <span className="font-medium">{s.title || 'Session'}</span> — {s.starts_at || ''}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" /> Announcements
          </CardTitle>
          <CardDescription>Messages from your trainers</CardDescription>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No announcements</p>
          ) : (
            <div className="space-y-3">
              {announcements
                .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0,10)
                .map((a) => (
                <div key={a.id}>
                  <div className="font-medium">{a.title || 'Announcement'}</div>
                  <div className="text-sm text-muted-foreground">{a.body}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Enrolled Batches */}
      {privileges.has("view_own_progress") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Courses
            </CardTitle>
            <CardDescription>Courses you are currently enrolled in</CardDescription>
          </CardHeader>
          <CardContent>
            {enrolledBatches.length === 0 ? (
              <p className="text-sm text-muted-foreground">No enrolled courses yet</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
              {(Array.isArray(enrolledBatches) ? enrolledBatches : []).map((enrollment:any) => (
                <Card key={enrollment.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{enrollment.batch_name || 'Batch'}</CardTitle>
                    <CardDescription>Batch ID: {enrollment.batch_id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Enrolled</Badge>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Available Courses */}
      {privileges.has("view_own_progress") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Available Courses
            </CardTitle>
            <CardDescription>Explore and enroll in new courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{course.duration_hours}h</span>
                      <Button size="sm">Enroll</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {privileges.has("view_own_progress") && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledBatches.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

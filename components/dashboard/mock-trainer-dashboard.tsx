"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Play, Eye } from "lucide-react"
import { mockData } from "@/lib/mock-auth"

export function MockTrainerDashboard() {
  const [batches] = useState(mockData.batches.filter((batch) => batch.status === "active"))
  const [sessions, setSessions] = useState(mockData.sessions)
  const [sessionCode, setSessionCode] = useState("")
  const [activeSession, setActiveSession] = useState<any>(null)

  const startSession = (session: any) => {
    setActiveSession(session)
    setSessionCode(session.session_code)
  }

  const endSession = () => {
    if (activeSession) {
      setSessions(sessions.map((s) => (s.id === activeSession.id ? { ...s, status: "completed" } : s)))
    }
    setActiveSession(null)
    setSessionCode("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
        <p className="text-muted-foreground">Manage your batches and sessions</p>
      </div>

      {/* Active Session */}
      {activeSession && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Active Session</CardTitle>
            <CardDescription>
              Session Code: <span className="font-mono text-lg font-bold">{sessionCode}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{activeSession.title}</p>
                <p className="text-sm text-muted-foreground">{activeSession.batch.name}</p>
              </div>
              <Button onClick={endSession} variant="destructive">
                End Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* My Batches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Batches
            </CardTitle>
            <CardDescription>Batches you are training</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {batches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{batch.name}</p>
                  <p className="text-sm text-muted-foreground">{batch.course.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={batch.status === "active" ? "default" : "secondary"}>{batch.status}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {batch.enrolled_count}/{batch.max_students} students
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
            <CardDescription>Your recent training sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{session.title}</p>
                  <p className="text-sm text-muted-foreground">{session.batch.name}</p>
                  <Badge
                    variant={
                      session.status === "active" ? "default" : session.status === "completed" ? "secondary" : "outline"
                    }
                  >
                    {session.status}
                  </Badge>
                </div>
                {session.status === "scheduled" && (
                  <Button size="sm" onClick={() => startSession(session)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Create Session</CardTitle>
            <CardDescription>Start a new training session</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">View Attendance</CardTitle>
            <CardDescription>Check session attendance</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Progress Reports</CardTitle>
            <CardDescription>View batch progress</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
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
import { BookOpen, Calendar, Trophy, LogIn } from "lucide-react"
import { mockData } from "@/lib/mock-auth"

export function MockStudentDashboard() {
  const [enrolledBatches] = useState(mockData.batches.filter((batch) => batch.status === "active"))
  const [availableCourses] = useState(mockData.courses)
  const [sessionCode, setSessionCode] = useState("")
  const [joinSessionOpen, setJoinSessionOpen] = useState(false)

  const joinSession = () => {
    if (!sessionCode.trim()) return

    // Mock session join
    alert(`Successfully joined session with code: ${sessionCode}`)
    setJoinSessionOpen(false)
    setSessionCode("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Your learning journey</p>
        </div>

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
      </div>

      {/* Enrolled Batches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            My Courses
          </CardTitle>
          <CardDescription>Courses you are currently enrolled in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {enrolledBatches.map((batch) => (
              <Card key={batch.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{batch.course.title}</CardTitle>
                  <CardDescription>
                    Batch: {batch.name} • Trainer: {batch.trainer.full_name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={batch.status === "active" ? "default" : "secondary"}>{batch.status}</Badge>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Courses */}
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

      {/* Quick Stats */}
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
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

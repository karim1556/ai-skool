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
import { BookOpen, Calendar, Trophy, LogIn } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentMockUser } from "@/lib/mock-auth"
import { mockStudents } from "@/lib/mock-data"

interface StudentDashboardProps {
  userId: string
}

export function StudentDashboard({ userId }: StudentDashboardProps) {
  const [enrolledBatches, setEnrolledBatches] = useState<any[]>([])
  const [availableCourses, setAvailableCourses] = useState<any[]>([])
  const [sessionCode, setSessionCode] = useState("")
  const [joinSessionOpen, setJoinSessionOpen] = useState(false)

  // Get current student's privileges
  let privileges: string[] = []
  if (typeof window !== "undefined") {
    const user = getCurrentMockUser()
    if (user) {
      const student = mockStudents.find((s) => s.email === user.email)
      if (student) privileges = student.privileges || []
    }
  }

  useEffect(() => {
    fetchStudentData()
  }, [userId])

  const fetchStudentData = async () => {
    try {
      // Fetch enrolled batches
      const { data: enrollments } = await supabase
        .from("batch_enrollments")
        .select(`
          *,
          batch:batches(
            *,
            course:courses(title),
            trainer:profiles!trainer_id(full_name)
          )
        `)
        .eq("student_id", userId)
        .eq("is_approved", true)

      // Fetch available courses
      const { data: courses } = await supabase.from("courses").select("*").limit(6)

      setEnrolledBatches(enrollments || [])
      setAvailableCourses(courses || [])
    } catch (error) {
      console.error("Error fetching student data:", error)
    }
  }

  const joinSession = async () => {
    if (!sessionCode.trim()) return

    try {
      // Find active session with this code
      const { data: session } = await supabase
        .from("sessions")
        .select("*")
        .eq("session_code", sessionCode.toUpperCase())
        .eq("status", "active")
        .single()

      if (!session) {
        alert("Invalid or inactive session code")
        return
      }

      // Record attendance
      await supabase.from("attendance").upsert({
        session_id: session.id,
        student_id: userId,
        login_time: new Date().toISOString(),
        is_present: true,
      })

      setJoinSessionOpen(false)
      setSessionCode("")
      alert("Successfully joined session!")
    } catch (error) {
      console.error("Error joining session:", error)
      alert("Failed to join session")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Your learning journey</p>
        </div>

        {privileges.includes("join_session") && (
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
      </div>

      {/* Enrolled Batches */}
      {privileges.includes("view_own_progress") && (
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
                {enrolledBatches.map((enrollment) => (
                  <Card key={enrollment.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{enrollment.batch.course?.title}</CardTitle>
                      <CardDescription>
                        Batch: {enrollment.batch.name} • Trainer: {enrollment.batch.trainer?.full_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant={enrollment.batch.status === "active" ? "default" : "secondary"}>
                          {enrollment.batch.status}
                        </Badge>
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
      {privileges.includes("view_own_progress") && (
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
      {privileges.includes("view_own_progress") && (
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

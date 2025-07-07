"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Calendar, GraduationCap, TrendingUp, Video, UserCheck } from "lucide-react"
import { mockData } from "@/lib/mock-auth"
import {
  mockTrainers,
  mockCoordinators,
  mockStudents,
  mockSchools,
  mockBatches,
  mockAssignments,
} from "@/lib/mock-data"

export function EnhancedAdminDashboard() {
  const [stats, setStats] = useState({
    courses: 0,
    lessons: 0,
    enrollments: 0,
    students: 0,
    activeCourses: 0,
    pendingCourses: 0,
    trainers: 0,
    coordinators: 0,
    schools: 0,
    activeBatches: 0,
    pendingBatches: 0,
    assignments: 0,
  })

  const [pendingUsers, setPendingUsers] = useState(mockData.pendingUsers)
  const [pendingBatches, setPendingBatches] = useState(mockBatches.filter((batch) => batch.status === "pending"))

  useEffect(() => {
    // Calculate real stats from mock data
    const activeBatches = mockBatches.filter((batch) => batch.status === "active").length
    const pendingBatchesCount = mockBatches.filter((batch) => batch.status === "pending").length
    const totalEnrollments = mockBatches.reduce((sum, batch) => sum + batch.noOfStudents, 0)

    setStats({
      courses: mockData.courses.length,
      lessons: 229, // Mock lesson count
      enrollments: totalEnrollments,
      students: mockStudents.length,
      activeCourses: mockData.courses.length,
      pendingCourses: 0,
      trainers: mockTrainers.length,
      coordinators: mockCoordinators.length,
      schools: mockSchools.length,
      activeBatches,
      pendingBatches: pendingBatchesCount,
      assignments: mockAssignments.length,
    })
  }, [])

  const approveUser = (userId: string) => {
    setPendingUsers(pendingUsers.filter((user) => user.id !== userId))
  }

  const approveBatch = (batchId: number) => {
    setPendingBatches(pendingBatches.filter((batch) => batch.id !== batchId))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to EduFlow LMS Admin Panel</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Number courses</CardTitle>
            <BookOpen className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.courses}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Number of lessons</CardTitle>
            <Video className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.lessons}</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Number of enrolment</CardTitle>
            <UserCheck className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.enrollments}</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Number of student</CardTitle>
            <Users className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.students}</div>
            <p className="text-xs text-muted-foreground">+8 from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Trainers</CardTitle>
            <GraduationCap className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trainers}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Coordinators</CardTitle>
            <UserCheck className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coordinators}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Schools</CardTitle>
            <BookOpen className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.schools}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Assignments</CardTitle>
            <Calendar className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignments}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>COURSE OVERVIEW</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" className="opacity-20" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(stats.activeCourses / (stats.activeCourses + stats.pendingCourses || 1)) * 251.2} 251.2`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.activeCourses + stats.pendingCourses}</div>
                    <div className="text-sm text-gray-500">Total Courses</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold">{stats.activeCourses}</span>
                </div>
                <div className="text-sm text-gray-600">Active courses</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-yellow-500" />
                  <span className="text-2xl font-bold">{stats.pendingCourses}</span>
                </div>
                <div className="text-sm text-gray-600">Pending courses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Add New Course
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Add Instructor
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Create Batch
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <GraduationCap className="h-4 w-4 mr-2" />
              Enroll Student
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending User Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending User Approvals</CardTitle>
            <CardDescription>Users waiting for approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending approvals</p>
            ) : (
              pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                  <Button size="sm" onClick={() => approveUser(user.id)} className="bg-green-600 hover:bg-green-700">
                    Approve
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pending Batch Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Batch Approvals</CardTitle>
            <CardDescription>Batches waiting for approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingBatches.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending batch approvals</p>
            ) : (
              pendingBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{batch.batchName}</p>
                    <p className="text-sm text-muted-foreground">
                      {batch.course} - {batch.trainer}
                    </p>
                    <Badge variant="outline">{batch.status}</Badge>
                  </div>
                  <Button size="sm" onClick={() => approveBatch(batch.id)} className="bg-green-600 hover:bg-green-700">
                    Approve
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New instructor application received</p>
                <p className="text-xs text-gray-500">Sarah Johnson applied for Data Science instructor role</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Batch approved successfully</p>
                <p className="text-xs text-gray-500">Web Development Batch 2024-A has been approved</p>
              </div>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Course completion milestone</p>
                <p className="text-xs text-gray-500">25 students completed JavaScript Fundamentals course</p>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New assignment created</p>
                <p className="text-xs text-gray-500">React Components assignment added to Web Dev batch</p>
              </div>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

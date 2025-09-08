"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Calendar, GraduationCap, TrendingUp, Video, UserCheck } from "lucide-react"
import { mockData } from "@/lib/mock-auth"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

export function EnhancedAdminDashboard() {
  const { counts: stats, loading, error, activeBatches, upcomingSessions, latestCourses } = useDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to EduFlow LMS Admin Panel</p>
      </div>

      {error && (
        <Card>
          <CardContent>
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Number courses</CardTitle>
            <BookOpen className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "-" : stats.courses}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Number of lessons</CardTitle>
            <Video className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "-" : stats.lessons}</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Number of enrolment</CardTitle>
            <UserCheck className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "-" : stats.enrollments}</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Number of student</CardTitle>
            <Users className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? "-" : stats.students}</div>
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
            <div className="text-2xl font-bold">{loading ? "-" : stats.trainers}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Coordinators</CardTitle>
            <UserCheck className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : stats.coordinators}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Schools</CardTitle>
            <BookOpen className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : stats.schools}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Assignments</CardTitle>
            <Calendar className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : stats.assignments}</div>
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
                    strokeDasharray={`${((loading ? 0 : stats.activeCourses) / ((loading ? 1 : stats.activeCourses + stats.pendingCourses) || 1)) * 251.2} 251.2`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{loading ? "-" : stats.activeCourses + stats.pendingCourses}</div>
                    <div className="text-sm text-gray-500">Total Courses</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold">{loading ? "-" : stats.activeCourses}</span>
                </div>
                <div className="text-sm text-gray-600">Active courses</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-yellow-500" />
                  <span className="text-2xl font-bold">{loading ? "-" : stats.pendingCourses}</span>
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

      {/* Privilege Management section removed as per requirements */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Batches */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Batches</CardTitle>
            <CardDescription>Recently active cohorts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(activeBatches ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No active batches</p>
            ) : (
              (activeBatches ?? []).map((b: any) => (
                <div key={b.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.course?.title} • Trainer: {b.trainer?.full_name}</p>
                    </div>
                    <Badge variant="outline">{b.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Next scheduled classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(upcomingSessions ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming sessions</p>
            ) : (
              (upcomingSessions ?? []).map((s: any) => (
                <div key={s.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.batch?.name} • {new Date(s.scheduled_date).toLocaleString()}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latest Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Courses</CardTitle>
          <CardDescription>Recently added courses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(latestCourses ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No courses yet</p>
          ) : (
            (latestCourses ?? []).map((c: any) => (
              <div key={c.id} className="p-3 border rounded-lg flex items-center justify-between">
                <p className="font-medium">{c.title}</p>
                <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

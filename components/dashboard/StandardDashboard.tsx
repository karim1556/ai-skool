"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, UserCheck, Users, GraduationCap, Calendar, TrendingUp } from "lucide-react"

export type Stat = { label: string; value: number | string; icon?: ReactNode; hint?: string }
export type QuickAction = { label: string; icon?: ReactNode; onClick?: () => void }
export type Activity = { color: string; title: string; description: string; time: string }

export default function StandardDashboard({
  title,
  subtitle,
  stats = [],
  secondaryStats = [],
  totalCourses = 0,
  activeCourses = 0,
  pendingCourses = 0,
  quickActions = [],
  activities = [],
}: {
  title: string
  subtitle?: string
  stats?: Stat[]
  secondaryStats?: Stat[]
  totalCourses?: number
  activeCourses?: number
  pendingCourses?: number
  quickActions?: QuickAction[]
  activities?: Activity[]
}) {
  const activeRatio = (activeCourses / (activeCourses + pendingCourses || 1)) * 251.2

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Main Stats Cards */}
      {stats.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{s.label}</CardTitle>
                <div className="h-8 w-8 text-gray-400">{s.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{s.value}</div>
                {s.hint && <p className="text-xs text-muted-foreground">{s.hint}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Secondary Stats */}
      {secondaryStats.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {secondaryStats.map((s, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{s.label}</CardTitle>
                <div className="h-8 w-8 text-gray-400">{s.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>COURSE OVERVIEW</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center justify-center">
              <div className="relative h-48 w-48">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" className="opacity-20" />
                  <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray={`${activeRatio} 251.2`} className="transition-all duration-300" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalCourses}</div>
                    <div className="text-sm text-gray-500">Total Courses</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold">{activeCourses}</span>
                </div>
                <div className="text-sm text-gray-600">Active courses</div>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 text-yellow-500" />
                  <span className="text-2xl font-bold">{pendingCourses}</span>
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
            <CardDescription>Common actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.length === 0 && <p className="text-sm text-muted-foreground">No quick actions</p>}
            {quickActions.map((qa, idx) => (
              <Button key={idx} className="w-full justify-start bg-transparent" variant="outline" onClick={qa.onClick}>
                <div className="mr-2 h-4 w-4">{qa.icon}</div>
                {qa.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 && <p className="text-sm text-muted-foreground">No recent activity</p>}
            {activities.map((a, idx) => (
              <div key={idx} className={`flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors ${a.color}`}> 
                <div className="h-2 w-2 rounded-full bg-current"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.description}</p>
                </div>
                <span className="text-xs text-gray-500">{a.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Calendar, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Profile, Batch } from "@/lib/supabase"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    activeBatches: 0,
    totalCourses: 0,
  })
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([])
  const [pendingBatches, setPendingBatches] = useState<Batch[]>([])

  useEffect(() => {
    fetchStats()
    fetchPendingApprovals()
  }, [])

  const fetchStats = async () => {
    try {
      const [usersResult, batchesResult, coursesResult] = await Promise.all([
        supabase.from("profiles").select("id, is_approved"),
        supabase.from("batches").select("id, status"),
        supabase.from("courses").select("id"),
      ])

      const totalUsers = usersResult.data?.length || 0
      const pendingApprovals = usersResult.data?.filter((u) => !u.is_approved).length || 0
      const activeBatches = batchesResult.data?.filter((b) => b.status === "active").length || 0
      const totalCourses = coursesResult.data?.length || 0

      setStats({ totalUsers, pendingApprovals, activeBatches, totalCourses })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchPendingApprovals = async () => {
    try {
      const { data: users } = await supabase.from("profiles").select("*").eq("is_approved", false).limit(5)

      const { data: batches } = await supabase
        .from("batches")
        .select("*, course:courses(title), trainer:profiles!trainer_id(full_name)")
        .eq("status", "pending")
        .limit(5)

      setPendingUsers(users || [])
      setPendingBatches(batches || [])
    } catch (error) {
      console.error("Error fetching pending approvals:", error)
    }
  }

  const approveUser = async (userId: string) => {
    try {
      await supabase.from("profiles").update({ is_approved: true }).eq("id", userId)

      fetchStats()
      fetchPendingApprovals()
    } catch (error) {
      console.error("Error approving user:", error)
    }
  }

  const approveBatch = async (batchId: string) => {
    try {
      await supabase.from("batches").update({ status: "approved" }).eq("id", batchId)

      fetchStats()
      fetchPendingApprovals()
    } catch (error) {
      console.error("Error approving batch:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, courses, and system overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBatches}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
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
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                  <Button size="sm" onClick={() => approveUser(user.id)}>
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
                <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{batch.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {batch.course?.title} - {batch.trainer?.full_name}
                    </p>
                    <Badge variant="outline">{batch.status}</Badge>
                  </div>
                  <Button size="sm" onClick={() => approveBatch(batch.id)}>
                    Approve
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

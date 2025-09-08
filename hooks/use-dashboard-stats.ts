"use client"

import { useEffect, useState } from "react"

export interface DashboardCounts {
  courses: number
  lessons: number
  enrollments: number
  students: number
  trainers: number
  coordinators: number
  schools: number
  assignments: number
  activeCourses: number
  pendingCourses: number
}

export function useDashboardStats() {
  const [counts, setCounts] = useState<DashboardCounts>({
    courses: 0,
    lessons: 0,
    enrollments: 0,
    students: 0,
    trainers: 0,
    coordinators: 0,
    schools: 0,
    assignments: 0,
    activeCourses: 0,
    pendingCourses: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [latestCourses, setLatestCourses] = useState<any[]>([])
  const [activeBatches, setActiveBatches] = useState<any[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])

  useEffect(() => {
    let isMounted = true

    async function fetchCounts() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" })
        if (!res.ok) {
          throw new Error(`Failed to fetch stats: ${res.status}`)
        }
        const data = await res.json()
        if (!isMounted) return

        let nextCounts: DashboardCounts = data.counts as DashboardCounts

        // Fallbacks
        try {
          if ((nextCounts.trainers ?? 0) === 0) {
            const t = await fetch("/api/trainers", { cache: "no-store" })
            if (t.ok) {
              const tData = await t.json()
              nextCounts.trainers = Array.isArray(tData) ? tData.length : nextCounts.trainers
            }
          }
        } catch {}
        try {
          if ((nextCounts.coordinators ?? 0) === 0) {
            const c = await fetch("/api/coordinators", { cache: "no-store" })
            if (c.ok) {
              const cData = await c.json()
              nextCounts.coordinators = Array.isArray(cData) ? cData.length : nextCounts.coordinators
            }
          }
        } catch {}
        // Ensure course overview shows something when we have courses
        if ((nextCounts.activeCourses + nextCounts.pendingCourses) === 0 && (nextCounts.courses ?? 0) > 0) {
          nextCounts = { ...nextCounts, activeCourses: nextCounts.courses, pendingCourses: 0 }
        }

        setCounts(nextCounts)
        setLatestCourses(data.latestCourses ?? [])
        setActiveBatches(data.activeBatches ?? [])
        setUpcomingSessions(data.upcomingSessions ?? [])
      } catch (e: any) {
        if (!isMounted) return
        setError(e?.message || "Failed to load stats")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCounts()

    return () => {
      isMounted = false
    }
  }, [])

  return { counts, loading, error, latestCourses, activeBatches, upcomingSessions }
}

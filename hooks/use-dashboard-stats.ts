"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

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

  useEffect(() => {
    let isMounted = true

    async function fetchCounts() {
      setLoading(true)
      setError(null)
      try {
        const [coursesRes, profilesStudents, profilesTrainers, profilesCoordinators, schoolsRes, enrollmentsRes, assignmentsRes, activeCourseRes, pendingCourseRes] = await Promise.all([
          supabase.from("courses").select("id", { count: "exact", head: true }),
          supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .in("role", ["trainer", "instructor"]),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .in("role", ["coordinator", "school_coordinator", "camp_coordinator"]),
          supabase.from("schools").select("id", { count: "exact", head: true }),
          supabase.from("batch_enrollments").select("id", { count: "exact", head: true }),
          supabase.from("assignments").select("id", { count: "exact", head: true }),
          supabase.from("courses").select("id", { count: "exact", head: true }).eq("status", "active"),
          supabase.from("courses").select("id", { count: "exact", head: true }).eq("status", "pending"),
        ])

        if (!isMounted) return

        // Lessons count is optional; fall back to 0 if table is absent
        let lessonsCount = 0
        try {
          const lessonsRes = await supabase.from("lessons").select("id", { count: "exact", head: true })
          lessonsCount = lessonsRes.count ?? 0
        } catch (_) {
          lessonsCount = 0
        }

        setCounts({
          courses: coursesRes.count ?? 0,
          lessons: lessonsCount,
          enrollments: enrollmentsRes.count ?? 0,
          students: profilesStudents.count ?? 0,
          trainers: profilesTrainers.count ?? 0,
          coordinators: profilesCoordinators.count ?? 0,
          schools: schoolsRes.count ?? 0,
          assignments: assignmentsRes.count ?? 0,
          activeCourses: activeCourseRes.count ?? 0,
          pendingCourses: pendingCourseRes.count ?? 0,
        })
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

  return { counts, loading, error }
}

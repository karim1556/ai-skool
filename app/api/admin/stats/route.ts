import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

// Server-side Supabase configuration (optional). Use server-only env vars to avoid
// exposing Supabase config to the client bundle at build time.
const supabaseUrl = process.env.SUPABASE_URL as string | undefined
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined

export async function GET() {
  try {
    // If Supabase envs are configured, dynamically import the client and use it.
    // Dynamic import avoids bundling client-only realtime modules at build time.
    let coursesRes: any = { count: 0, data: [] }
    let studentsRes: any = { count: 0 }
    let trainersRes: any = { count: 0 }
    let coordsRes: any = { count: 0 }
    let schoolsRes: any = { count: 0 }
    let enrollRes: any = { count: 0 }
    let assignmentsRes: any = { count: 0 }
    let activeBatchesCourseIds: any = { data: [] }
    let pendingBatchesCourseIds: any = { data: [] }
    let distinctTrainerIds: any = { data: [] }
    let distinctCoordinatorIds: any = { data: [] }

    if (supabaseUrl && serviceKey) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

      ;[coursesRes, studentsRes, trainersRes, coordsRes, schoolsRes, enrollRes, assignmentsRes, activeBatchesCourseIds, pendingBatchesCourseIds, distinctTrainerIds, distinctCoordinatorIds] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).in("role", ["trainer", "instructor"]),
        supabase.from("profiles").select("id", { count: "exact", head: true }).in("role", ["coordinator", "school_coordinator", "camp_coordinator"]),
        supabase.from("schools").select("id", { count: "exact", head: true }),
        supabase.from("batch_enrollments").select("id", { count: "exact", head: true }),
        supabase.from("assignments").select("id", { count: "exact", head: true }),
        // Compute active/pending courses via batches since courses.status may not exist
        supabase.from("batches").select("course_id", { head: false }).eq("status", "active"),
        supabase.from("batches").select("course_id", { head: false }).in("status", ["pending", "approved"]),
        supabase.from("batches").select("trainer_id", { head: false }).not("trainer_id", "is", null),
        supabase.from("batches").select("coordinator_id", { head: false }).not("coordinator_id", "is", null),
      ])
    } else {
      // Supabase not configured; fall back to local DB-derived counts where possible
      console.warn('Supabase admin stats route: Missing SUPABASE envs — falling back to local DB counts')
    }

    let lessonsCount = 0
    try {
      if (typeof (globalThis as any).supabase !== 'undefined') {
        // noop: keep for environments where supabase may be global
      }
      if (supabaseUrl && serviceKey) {
        const { createClient } = await import('@supabase/supabase-js')
        const tmp = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
        const lessonsRes = await tmp.from("lessons").select("id", { count: "exact", head: true })
        lessonsCount = lessonsRes.count ?? 0
      }
    } catch {
      lessonsCount = 0
    }

    // Additional lists for dashboard sections
    let latestCourses: any[] = []
    let activeBatches: any[] = []
    let upcomingSessions: any[] = []
    if (supabaseUrl && serviceKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const tmp = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
        const results = await Promise.all([
          tmp.from("courses").select("id,title,created_at").order("created_at", { ascending: false }).limit(5),
          tmp
            .from("batches")
            .select("id,name,status,created_at, course:courses (title), trainer:profiles!batches_trainer_id_fkey(full_name)")
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(5),
          tmp
            .from("sessions")
            .select("id,title,scheduled_date,status, batch:batches(name)")
            .gt("scheduled_date", new Date().toISOString())
            .order("scheduled_date", { ascending: true })
            .limit(5),
        ])
        latestCourses = results[0].data ?? []
        activeBatches = results[1].data ?? []
        upcomingSessions = results[2].data ?? []
      } catch {
        latestCourses = []
        activeBatches = []
        upcomingSessions = []
      }
    }

    // Derive distinct counts from batches in case profile roles are missing
    const trainerDistinct = Array.isArray(distinctTrainerIds.data)
      ? new Set(distinctTrainerIds.data.map((r: any) => r.trainer_id)).size
      : 0
    const coordDistinct = Array.isArray(distinctCoordinatorIds.data)
      ? new Set(distinctCoordinatorIds.data.map((r: any) => r.coordinator_id)).size
      : 0

    // Derive active/pending courses from batches
    const activeCoursesFromBatches = Array.isArray(activeBatchesCourseIds.data)
      ? new Set(activeBatchesCourseIds.data.map((r: any) => r.course_id)).size
      : 0
    const pendingCoursesFromBatches = Array.isArray(pendingBatchesCourseIds.data)
      ? new Set(pendingBatchesCourseIds.data.map((r: any) => r.course_id)).size
      : 0

    // Also check local Postgres tables for trainers/coordinators (used by Admin CRUD)
    let localTrainerCount = 0
    let localCoordinatorCount = 0
    try {
      const db = getDb()
      const trainersRows = await db.all<any>(`SELECT COUNT(*)::int AS c FROM trainers`)
      const coordRows = await db.all<any>(`SELECT COUNT(*)::int AS c FROM coordinators`)
      localTrainerCount = Number(trainersRows?.[0]?.c || 0)
      localCoordinatorCount = Number(coordRows?.[0]?.c || 0)
    } catch {
      // ignore if local DB not available
    }

    return NextResponse.json({
      counts: {
        courses: coursesRes.count ?? 0,
        lessons: lessonsCount,
        enrollments: enrollRes.count ?? 0,
        students: studentsRes.count ?? 0,
        trainers: Math.max(trainersRes.count ?? 0, trainerDistinct, localTrainerCount),
        coordinators: Math.max(coordsRes.count ?? 0, coordDistinct, localCoordinatorCount),
        schools: schoolsRes.count ?? 0,
        assignments: assignmentsRes.count ?? 0,
        activeCourses: activeCoursesFromBatches || (coursesRes.count ?? 0),
        pendingCourses: pendingCoursesFromBatches,
      },
      latestCourses: latestCourses ?? [],
      activeBatches: activeBatches ?? [],
      upcomingSessions: upcomingSessions ?? [],
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to load admin stats" }, { status: 500 })
  }
}

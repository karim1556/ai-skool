import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

async function getSchoolId(db:any, orgId:string) {
  const row = await db.get(`SELECT id FROM schools WHERE clerk_org_id = $1`, [orgId]) as any
  return row?.id || null
}

export async function GET(req: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const batchId = searchParams.get('batchId')
  if (!batchId) return NextResponse.json({ error: 'batchId is required' }, { status: 400 })
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Organization not selected' }, { status: 401 })
  const schoolId = await getSchoolId(db, orgId)
  if (!schoolId) return NextResponse.json({ error: 'No school bound to this organization' }, { status: 403 })
  try {
    // Verify batch belongs to this school
    const b = await db.get(`SELECT id FROM batches WHERE id = $1 AND school_id = $2`, [batchId, schoolId]) as any
    if (!b?.id) return NextResponse.json({ error: 'Batch not in your school' }, { status: 403 })

    const [studentCountRow, sessionCountRow, presentRow, totalMarkedRow, assignmentCountRow, submissionsRow, gradedRow] = await Promise.all([
      db.get(`SELECT COUNT(*)::int AS c FROM batch_students WHERE batch_id = $1`, [batchId]) as any,
      db.get(`SELECT COUNT(*)::int AS c FROM sessions WHERE batch_id = $1`, [batchId]) as any,
      db.get(`SELECT COUNT(*)::int AS c FROM session_attendance sa INNER JOIN sessions s ON s.id = sa.session_id WHERE s.batch_id = $1 AND sa.present = true`, [batchId]) as any,
      db.get(`SELECT COUNT(*)::int AS c FROM session_attendance sa INNER JOIN sessions s ON s.id = sa.session_id WHERE s.batch_id = $1`, [batchId]) as any,
      db.get(`SELECT COUNT(*)::int AS c FROM trainer_assignments WHERE batch_id = $1`, [batchId]) as any,
      db.get(`SELECT COUNT(*)::int AS c FROM submissions sub INNER JOIN trainer_assignments a ON a.id = sub.assignment_id WHERE a.batch_id = $1`, [batchId]) as any,
      db.get(`SELECT COUNT(*)::int AS c FROM submissions sub INNER JOIN trainer_assignments a ON a.id = sub.assignment_id WHERE a.batch_id = $1 AND sub.grade IS NOT NULL`, [batchId]) as any,
    ])

    const studentCount = studentCountRow?.c || 0
    const sessionCount = sessionCountRow?.c || 0
    const totalMarked = totalMarkedRow?.c || 0
    const presentCount = presentRow?.c || 0
    const attendancePercent = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0
    const assignmentCount = assignmentCountRow?.c || 0
    const submissionsCount = submissionsRow?.c || 0
    const gradedCount = gradedRow?.c || 0

    return NextResponse.json({
      studentCount,
      sessionCount,
      attendancePercent,
      assignmentCount,
      submissionsCount,
      gradedCount,
    })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'Failed to build batch report' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

async function ensureSchema(db: any) {
  await db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      batch_id UUID NOT NULL,
      trainer_id UUID NOT NULL,
      title TEXT,
      notes TEXT,
      session_date DATE,
      session_time TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)
}

async function getSchoolId(db: any, orgId: string) {
  const row = await db.get<{ id: string }>(`SELECT id FROM schools WHERE clerk_org_id = $1`, [orgId])
  return row?.id || null
}

export async function GET(req: NextRequest) {
  const db = getDb()
  await ensureSchema(db)
  const { searchParams } = new URL(req.url)
  const batchId = searchParams.get('batchId')
  const id = searchParams.get('id')
  const trainerId = searchParams.get('trainerId')
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Organization not selected' }, { status: 401 })
  const schoolId = await getSchoolId(db, orgId)
  if (!schoolId) return NextResponse.json({ error: 'No school bound to this organization' }, { status: 403 })
  try {
    const where: string[] = ['b.school_id = $1']
    const params: any[] = [schoolId]
    if (id) { where.push('s.id = $'+(params.length+1)); params.push(id) }
    if (batchId) { where.push('s.batch_id = $'+(params.length+1)); params.push(batchId) }
    if (trainerId) { where.push('s.trainer_id = $'+(params.length+1)); params.push(trainerId) }
    const rows = await db.all(
      `SELECT s.*
       FROM sessions s
       INNER JOIN batches b ON b.id = s.batch_id
       WHERE ${where.join(' AND ')}
       ORDER BY s.created_at DESC`,
      params
    )
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch sessions' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const db = getDb()
  await ensureSchema(db)
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Organization not selected' }, { status: 401 })
  const schoolId = await getSchoolId(db, orgId)
  if (!schoolId) return NextResponse.json({ error: 'No school bound to this organization' }, { status: 403 })
  try {
    const body = await req.json()
    const { batch_id, trainer_id, title, notes, session_date, session_time } = body || {}
    if (!batch_id || !trainer_id) return NextResponse.json({ error: 'batch_id and trainer_id are required' }, { status: 400 })
    // Verify batch and trainer belong to this school
    const b = await db.get(`SELECT id FROM batches WHERE id = $1 AND school_id = $2`, [batch_id, schoolId])
    if (!b?.id) return NextResponse.json({ error: 'Batch not in your school' }, { status: 403 })
    const t = await db.get(`SELECT id FROM trainers WHERE id = $1 AND school_id = $2`, [trainer_id, schoolId])
    if (!t?.id) return NextResponse.json({ error: 'Trainer not in your school' }, { status: 403 })
    const row = await db.get<{ id: string }>(
      `INSERT INTO sessions (batch_id, trainer_id, title, notes, session_date, session_time)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [batch_id, trainer_id, title || null, notes || null, session_date || null, session_time || null]
    )
    return NextResponse.json({ id: row?.id, success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create session' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const db = getDb()
  await ensureSchema(db)
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Organization not selected' }, { status: 401 })
  const schoolId = await getSchoolId(db, orgId)
  if (!schoolId) return NextResponse.json({ error: 'No school bound to this organization' }, { status: 403 })
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const body = await req.json()
    const allowed = ['title','notes','session_date','session_time','batch_id','trainer_id']
    const fields: string[] = []
    const values: any[] = []
    for (const key of allowed) {
      if (key in body) { fields.push(`${key} = $${fields.length + 1}`); values.push(body[key]) }
    }
    if (fields.length === 0) return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 })
    // Ensure the session belongs to this school via batch join
    const owns = await db.get(
      `SELECT s.id FROM sessions s INNER JOIN batches b ON b.id = s.batch_id WHERE s.id = $1 AND b.school_id = $2`,
      [id, schoolId]
    )
    if (!owns?.id) return NextResponse.json({ error: 'Session not in your school' }, { status: 403 })
    await db.run(`UPDATE sessions SET ${fields.join(', ')}, created_at = created_at WHERE id = $${fields.length + 1}`, [...values, id])
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to update session' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const db = getDb()
  await ensureSchema(db)
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Organization not selected' }, { status: 401 })
  const schoolId = await getSchoolId(db, orgId)
  if (!schoolId) return NextResponse.json({ error: 'No school bound to this organization' }, { status: 403 })
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    // Ensure session belongs to this school via batch join
    const owns = await db.get(
      `SELECT s.id FROM sessions s INNER JOIN batches b ON b.id = s.batch_id WHERE s.id = $1 AND b.school_id = $2`,
      [id, schoolId]
    )
    if (!owns?.id) return NextResponse.json({ error: 'Session not in your school' }, { status: 403 })
    await db.run(`DELETE FROM sessions WHERE id = $1`, [id])
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to delete session' }, { status: 500 })
  }
}

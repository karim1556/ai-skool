import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

async function ensureSchema(db:any) {
  await db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      school_id TEXT,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      phone TEXT,
      status TEXT,
      clerk_user_id TEXT UNIQUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)
}

async function getSchoolId(db:any, orgId:string) {
  const row = await db.get<{ id:string }>(`SELECT id FROM schools WHERE clerk_org_id = $1`, [orgId])
  return row?.id || null
}

function parseCsv(text:string) {
  // Simple CSV parser: expects header row with first_name,last_name,email,phone
  // Handles quoted values and commas inside quotes minimally
  const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0)
  if (lines.length === 0) return [] as any[]
  const header = lines[0].split(',').map(h=>h.trim().toLowerCase())
  const rows:any[] = []
  for (let i=1;i<lines.length;i++) {
    const raw = lines[i]
    const cells:string[] = []
    let cur = ''
    let inQ = false
    for (let j=0;j<raw.length;j++) {
      const ch = raw[j]
      if (ch === '"') {
        if (inQ && raw[j+1] === '"') { cur += '"'; j++; }
        else inQ = !inQ
      } else if (ch === ',' && !inQ) {
        cells.push(cur); cur = ''
      } else { cur += ch }
    }
    cells.push(cur)
    const obj:any = {}
    header.forEach((h, idx) => { obj[h] = (cells[idx] ?? '').trim() })
    rows.push(obj)
  }
  return rows
}

export async function POST(req: NextRequest) {
  const db = getDb(); await ensureSchema(db)
  const { orgId, userId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Organization not selected' }, { status: 401 })
  const schoolId = await getSchoolId(db, orgId)
  if (!schoolId) return NextResponse.json({ error: 'No school bound to this organization' }, { status: 403 })
  try {
    // Only coordinators can import students
    const coord = await db.get<{ id:string }>(`SELECT id FROM coordinators WHERE school_id = $1 AND clerk_user_id = $2`, [schoolId, userId])
    if (!coord?.id) return NextResponse.json({ error: 'Only coordinators can import students' }, { status: 403 })

    const ctype = req.headers.get('content-type') || ''
    let text = ''
    if (ctype.includes('multipart/form-data')) {
      const data = await req.formData()
      const file = data.get('file') as unknown as File | null
      if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 })
      text = await file.text()
    } else {
      text = await req.text()
    }
    if (!text || text.trim() === '') return NextResponse.json({ error: 'Empty CSV' }, { status: 400 })

    const rows = parseCsv(text)
    let inserted = 0, skipped = 0, errors: { line:number, error:string }[] = []
    for (let i=0;i<rows.length;i++) {
      const r = rows[i]
      const first = r.first_name || r.firstname || null
      const last = r.last_name || r.lastname || null
      const email = (r.email || '').toLowerCase()
      const phone = r.phone || null
      if (!email) { skipped++; errors.push({ line: i+2, error: 'Missing email' }); continue }
      const exists = await db.get<{ id:string }>(`SELECT id FROM students WHERE lower(email) = lower($1) AND school_id = $2`, [email, schoolId])
      if (exists?.id) { skipped++; continue }
      try {
        await db.run(
          `INSERT INTO students (school_id, first_name, last_name, email, phone, status) VALUES ($1,$2,$3,$4,$5,'verified')`,
          [schoolId, first, last, email, phone]
        )
        inserted++
      } catch (e:any) {
        skipped++; errors.push({ line: i+2, error: e?.message || 'insert failed' })
      }
    }

    return NextResponse.json({ success: true, inserted, skipped, errors })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'Failed to import students' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { generatePassword } from '@/lib/password'
import { findUserByEmail, createUser, setUserPassword, addUserToOrganization } from '@/lib/clerk'
import { sendPasswordEmail } from '@/lib/email'

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
      clerk_user_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)
  // Backfill columns if table exists without them
  await db.run(`ALTER TABLE students ADD COLUMN IF NOT EXISTS status TEXT;`)
  await db.run(`ALTER TABLE students ADD COLUMN IF NOT EXISTS password TEXT;`)
  await db.run(`ALTER TABLE students ADD COLUMN IF NOT EXISTS phone TEXT;`)
  await db.run(`ALTER TABLE students ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;`)
  // Drop legacy unique constraint if created via UNIQUE column syntax
  await db.run(`ALTER TABLE students DROP CONSTRAINT IF EXISTS students_clerk_user_id_key;`)
  // Ensure composite uniqueness per school for clerk_user_id and drop old single-column unique index if exists
  await db.run(`DROP INDEX IF EXISTS idx_students_clerk_user_id;`)
  await db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_students_school_clerk_uid ON students(school_id, clerk_user_id);`)
}

async function getSchoolId(db:any, orgId:string) {
  const row = await db.get(`SELECT id FROM schools WHERE clerk_org_id = $1`, [orgId]) as any
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
    const coord = await db.get(`SELECT id FROM coordinators WHERE school_id = $1 AND clerk_user_id = $2`, [schoolId, userId]) as any
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
      // Accept either first_name/last_name, or a single name column
      let first = r.first_name || r.firstname || null
      let last = r.last_name || r.lastname || null
      if ((!first || !last) && r.name) {
        const parts = String(r.name).trim().split(/\s+/)
        if (!first && parts.length > 0) first = parts[0]
        if (!last && parts.length > 1) last = parts.slice(1).join(' ')
      }
      const email = (r.email || '').toLowerCase()
      // Prefer mobile_number/mobile over phone if present
      const phone = r.mobile_number || r.mobilenumber || r.mobile || r.phone || null
      // Use provided password if present; else generate
      const providedPwd = r.password ? String(r.password) : ''
      if (!email) { skipped++; errors.push({ line: i+2, error: 'Missing email' }); continue }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRe.test(email)) { skipped++; errors.push({ line: i+2, error: `Invalid email format: ${email}` }); continue }
      const exists = await db.get(`SELECT id FROM students WHERE lower(email) = lower($1) AND school_id = $2`, [email, schoolId]) as any
      if (exists?.id) { skipped++; continue }
      // Create/find Clerk user and password
      const pwd = providedPwd && providedPwd.trim().length > 0 ? providedPwd.trim() : generatePassword()
      let clerkUserId: string | null = null
      try {
        const existing = await findUserByEmail(email)
        if (existing && existing.id) {
          clerkUserId = existing.id
          try { await setUserPassword(existing.id as string, pwd) } catch (e:any) {
            errors.push({ line: i+2, error: `Password update skipped: ${e?.message || 'unknown error'}` })
          }
        } else {
          const created = await createUser({ email, password: pwd, firstName: first || undefined, lastName: last || undefined })
          clerkUserId = created.id
        }
      } catch (e:any) {
        skipped++; errors.push({ line: i+2, error: `Clerk user error: ${e?.message || 'failed to create/find user'}` }); continue
      }
      // Add to current org (non-blocking). Try without role, and if Clerk complains about role, retry with configured/default role.
      try {
        await addUserToOrganization({ organizationId: orgId, userId: clerkUserId! })
      } catch (e:any) {
        const msg = String(e?.message || '')
        if (/role/i.test(msg)) {
          const fallbackRole = process.env.CLERK_STUDENT_ROLE || 'student'
          try {
            await addUserToOrganization({ organizationId: orgId, userId: clerkUserId!, role: fallbackRole })
          } catch (e2:any) {
            errors.push({ line: i+2, error: `Org membership warning (retry with role='${fallbackRole}') failed: ${e2?.message || 'could not add to organization'}` })
          }
        } else {
          errors.push({ line: i+2, error: `Org membership warning: ${msg || 'could not add to organization'}` })
        }
      }
      // Insert into DB with clerk_user_id and status verified
      try {
        await db.run(
          `INSERT INTO students (school_id, first_name, last_name, email, phone, status, clerk_user_id, password) VALUES ($1,$2,$3,$4,$5,'verified',$6,$7)`,
          [schoolId, first, last, email, phone, clerkUserId, pwd]
        )
        inserted++
      } catch (e:any) {
        skipped++; errors.push({ line: i+2, error: `DB insert error: ${e?.message || 'failed to insert student'}` }); continue
      }
      // Send credentials email (non-blocking)
      try { await sendPasswordEmail(email, pwd, { name: [first, last].filter(Boolean).join(' ') }) } catch (e:any) {
        errors.push({ line: i+2, error: `Email warning: ${e?.message || 'failed to send email'}` })
      }
    }

    return NextResponse.json({ success: true, inserted, skipped, errors })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'Failed to import students' }, { status: 500 })
  }
}

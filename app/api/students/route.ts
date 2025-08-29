import { NextRequest, NextResponse } from 'next/server';
import { getDb, sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server'
import { sendPasswordEmail } from '@/lib/email'
import { generatePassword } from '@/lib/password'
import { findUserByEmail, createUser, setUserPassword, addUserToOrganization } from '@/lib/clerk'

export const dynamic = 'force-dynamic';

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS students (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      biography TEXT,
      image_url TEXT,
      email TEXT,
      password TEXT,
      phone TEXT,
      parent_phone TEXT,
      address TEXT,
      state TEXT,
      district TEXT,
      school_id TEXT,
      clerk_user_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  // Add new columns if they don't exist
  try { await sql`ALTER TABLE students ADD COLUMN state TEXT`; } catch {}
  try { await sql`ALTER TABLE students ADD COLUMN district TEXT`; } catch {}
  try { await sql`ALTER TABLE students ADD COLUMN school_id TEXT`; } catch {}
  try { await sql`ALTER TABLE students ADD COLUMN clerk_user_id TEXT`; } catch {}
  // Ensure composite uniqueness per school for clerk_user_id and drop old single-column unique index if exists
  try { await sql`DROP INDEX IF EXISTS idx_students_clerk_user_id`; } catch {}
  try { await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_students_school_clerk_uid ON students(school_id, clerk_user_id)`; } catch {}
}

export async function GET(req: NextRequest) {
  await ensureSchema();
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Organization not selected' }, { status: 401 })
  const schoolRow = await db.get<{ id: string }>(`SELECT id FROM schools WHERE clerk_org_id = $1`, [orgId])
  if (!schoolRow?.id) return NextResponse.json({ error: 'No school bound to this organization' }, { status: 403 })
  const schoolId = schoolRow.id
  try {
    let rows;
    if (id) {
      rows = await db.all(`SELECT * FROM students WHERE id = $1 AND school_id = $2`, [id, schoolId]);
    } else {
      rows = await db.all(`SELECT * FROM students WHERE school_id = $1 ORDER BY created_at DESC`, [schoolId]);
    }
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const db = getDb();
  try {
    const body = await req.json();
    const {
      first_name,
      last_name,
      biography,
      image_url,
      email,
      password,
      phone,
      parent_phone,
      address,
      state,
      district,
    } = body || {};

    const { orgId } = await auth()
    if (!orgId) return NextResponse.json({ error: 'Organization not selected' }, { status: 401 })
    const schoolRow = await db.get<{ id: string }>(`SELECT id FROM schools WHERE clerk_org_id = $1`, [orgId])
    if (!schoolRow?.id) return NextResponse.json({ error: 'No school bound to this organization' }, { status: 403 })

    if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 })

    // 1) Ensure Clerk user exists with password
    const pwd = (password && String(password)) || generatePassword()
    const emailLower = String(email).toLowerCase()

    // Try to find existing user by email
    let clerkUserId: string
    const existing = await findUserByEmail(emailLower)
    if (existing && existing.id) {
      clerkUserId = existing.id
      try { await setUserPassword(clerkUserId, pwd) } catch {}
    } else {
      const created = await createUser({
        email: emailLower,
        password: pwd,
        firstName: first_name || undefined,
        lastName: last_name || undefined,
      })
      clerkUserId = created.id
    }

    // 2) Ensure membership in current organization (try without role; if role error, retry with configured role)
    try {
      await addUserToOrganization({ organizationId: orgId, userId: clerkUserId })
    } catch (e:any) {
      const msg = String(e?.message || '')
      if (/role/i.test(msg)) {
        const fallbackRole = process.env.CLERK_STUDENT_ROLE || 'student'
        try { await addUserToOrganization({ organizationId: orgId, userId: clerkUserId, role: fallbackRole }) } catch {}
      }
    }

    // 3) Insert or upsert student into DB with clerk_user_id
    let row = await db.get<{ id: string }>(
      `INSERT INTO students (
        first_name, last_name, biography, image_url, email, password, phone, parent_phone, address, state, district, school_id, clerk_user_id
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      ) RETURNING id`,
      [
        first_name || null,
        last_name || null,
        biography || null,
        image_url || null,
        emailLower,
        pwd,
        phone || null,
        parent_phone || null,
        address || null,
        state || null,
        district || null,
        schoolRow.id,
        clerkUserId,
      ]
    )

    // 4) Send credential email
    try { await sendPasswordEmail(emailLower, pwd, { name: [first_name, last_name].filter(Boolean).join(' ') }) } catch {}

    return NextResponse.json({ id: row?.id, success: true, clerkUserId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create student' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  await ensureSchema();
  const db = getDb();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const body = await req.json();
    const allowed = [
      'first_name','last_name','biography','image_url','email','password','phone','parent_phone','address','state','district','school_id','clerk_user_id'
    ];
    const fields: string[] = [];
    const values: any[] = [];
    for (const key of allowed) {
      if (key in body) {
        fields.push(`${key} = $${fields.length + 1}`);
        values.push(body[key]);
      }
    }
    if (fields.length === 0) return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
    const { orgId } = await auth()
    if (!orgId) return NextResponse.json({ error: 'Organization not selected' }, { status: 401 })
    const schoolRow = await db.get<{ id: string }>(`SELECT id FROM schools WHERE clerk_org_id = $1`, [orgId])
    if (!schoolRow?.id) return NextResponse.json({ error: 'No school bound to this organization' }, { status: 403 })
    await db.run(`UPDATE students SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${fields.length + 1} AND school_id = $${fields.length + 2}`, [...values, id, schoolRow.id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await ensureSchema();
  const db = getDb();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const { orgId } = await auth()
    if (!orgId) return NextResponse.json({ error: 'Organization not selected' }, { status: 401 })
    const schoolRow = await db.get<{ id: string }>(`SELECT id FROM schools WHERE clerk_org_id = $1`, [orgId])
    if (!schoolRow?.id) return NextResponse.json({ error: 'No school bound to this organization' }, { status: 403 })
    await db.run(`DELETE FROM students WHERE id = $1 AND school_id = $2`, [id, schoolRow.id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to delete student' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getDb, sql } from '@/lib/db';

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
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  // Add new columns if they don't exist
  try { await sql`ALTER TABLE students ADD COLUMN state TEXT`; } catch {}
  try { await sql`ALTER TABLE students ADD COLUMN district TEXT`; } catch {}
  try { await sql`ALTER TABLE students ADD COLUMN school_id TEXT`; } catch {}
}

export async function GET(req: NextRequest) {
  await ensureSchema();
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  try {
    let rows;
    if (id) {
      rows = await db.all(`SELECT * FROM students WHERE id = $1`, [id]);
    } else {
      rows = await db.all(`SELECT * FROM students ORDER BY created_at DESC`);
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
      school_id,
    } = body || {};

    const row = await db.get<{ id: string }>(
      `INSERT INTO students (
        first_name, last_name, biography, image_url, email, password, phone, parent_phone, address, state, district, school_id
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      ) RETURNING id`,
      [
        first_name || null,
        last_name || null,
        biography || null,
        image_url || null,
        email || null,
        password || null,
        phone || null,
        parent_phone || null,
        address || null,
        state || null,
        district || null,
        school_id || null,
      ]
    );

    return NextResponse.json({ id: row?.id, success: true });
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
      'first_name','last_name','biography','image_url','email','password','phone','parent_phone','address','state','district','school_id'
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
    await db.run(`UPDATE students SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${fields.length + 1}`, [...values, id]);
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
    await db.run(`DELETE FROM students WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to delete student' }, { status: 500 });
  }
}

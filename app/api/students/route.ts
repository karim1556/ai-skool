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
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

export async function GET(req: NextRequest) {
  await ensureSchema();
  const db = getDb();
  try {
    const rows = await db.all(`SELECT * FROM students ORDER BY created_at DESC`);
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
    } = body || {};

    const row = await db.get<{ id: string }>(
      `INSERT INTO students (
        first_name, last_name, biography, image_url, email, password, phone, parent_phone, address
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
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
      ]
    );

    return NextResponse.json({ id: row?.id, success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create student' }, { status: 500 });
  }
}

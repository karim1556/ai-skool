import { NextRequest, NextResponse } from 'next/server';
import { getDb, sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS trainers (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      school_id TEXT,
      coordinator_id UUID,
      first_name TEXT,
      last_name TEXT,
      gender TEXT,
      dob DATE,
      pincode TEXT,
      address TEXT,
      image_url TEXT,
      status TEXT,
      email TEXT,
      password TEXT,
      highest_school TEXT,
      experience_years INTEGER,
      specialization TEXT,
      certifications TEXT,
      phone TEXT,
      linkedin TEXT,
      twitter TEXT,
      bio TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
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
      'school_id','coordinator_id','first_name','last_name','gender','dob','pincode','address','image_url','status','email','password',
      'highest_school','experience_years','specialization','certifications','phone','linkedin','twitter','bio'
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
    await db.run(`UPDATE trainers SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${fields.length + 1}`, [...values, id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to update trainer' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await ensureSchema();
  const db = getDb();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    await db.run(`DELETE FROM trainers WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to delete trainer' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await ensureSchema();
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const schoolId = searchParams.get('schoolId');

  try {
    let rows;
    if (id) {
      rows = await db.all(`SELECT * FROM trainers WHERE id = $1`, [id]);
    } else if (schoolId) {
      rows = await db.all(`SELECT * FROM trainers WHERE school_id = $1 ORDER BY created_at DESC`, [schoolId]);
    } else {
      rows = await db.all(`SELECT * FROM trainers ORDER BY created_at DESC`);
    }
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch trainers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const db = getDb();
  try {
    const body = await req.json();
    const {
      school_id,
      coordinator_id,
      first_name,
      last_name,
      gender,
      dob,
      pincode,
      address,
      image_url,
      status,
      email,
      password,
      highest_school,
      experience_years,
      specialization,
      certifications,
      phone,
      linkedin,
      twitter,
      bio,
    } = body || {};

    const row = await db.get<{ id: string }>(
      `INSERT INTO trainers (
        school_id, coordinator_id, first_name, last_name, gender, dob, pincode, address, image_url, status,
        email, password, highest_school, experience_years, specialization, certifications, phone, linkedin, twitter, bio
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20
      ) RETURNING id`,
      [
        school_id || null,
        coordinator_id || null,
        first_name || null,
        last_name || null,
        gender || null,
        dob || null,
        pincode || null,
        address || null,
        image_url || null,
        status || 'verified',
        email || null,
        password || null,
        highest_school || null,
        Number.isFinite(+experience_years) ? +experience_years : null,
        specialization || null,
        certifications || null,
        phone || null,
        linkedin || null,
        twitter || null,
        bio || null,
      ]
    );

    return NextResponse.json({ id: row?.id, success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create trainer' }, { status: 500 });
  }
}

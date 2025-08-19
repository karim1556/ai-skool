import { NextRequest, NextResponse } from 'next/server';
import { getDb, sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS batches (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      school_id TEXT,
      course_id UUID,
      start_date DATE,
      end_date DATE,
      max_students INTEGER,
      status TEXT DEFAULT 'pending',
      schedule TEXT,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS batch_students (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      batch_id UUID NOT NULL,
      student_id UUID NOT NULL,
      added_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (batch_id, student_id)
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS batch_trainers (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      batch_id UUID NOT NULL,
      trainer_id UUID NOT NULL,
      added_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (batch_id, trainer_id)
    );
  `;
}

export async function GET(req: NextRequest) {
  await ensureSchema();
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const schoolId = searchParams.get('schoolId');

  try {
    let rows;
    if (schoolId) {
      rows = await db.all(`SELECT * FROM batches WHERE school_id = $1 ORDER BY created_at DESC`, [schoolId]);
    } else {
      rows = await db.all(`SELECT * FROM batches ORDER BY created_at DESC`);
    }
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch batches' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  try {
    const body = await req.json();
    const {
      name,
      school_id,
      course_id,
      start_date,
      end_date,
      max_students,
      status,
      schedule,
      description,
      trainerIds = [],
      studentIds = [],
    } = body || {};

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const result = await sql.begin(async (trx) => {
      const inserted = await trx`
        INSERT INTO batches (name, school_id, course_id, start_date, end_date, max_students, status, schedule, description)
        VALUES (${name}, ${school_id || null}, ${course_id || null}, ${start_date || null}, ${end_date || null}, ${Number.isFinite(+max_students) ? +max_students : null}, ${status || 'pending'}, ${schedule || null}, ${description || null})
        RETURNING id
      `;
      const batchId = inserted[0]?.id as string;

      if (Array.isArray(trainerIds) && trainerIds.length) {
        for (const tid of trainerIds) {
          await trx`
            INSERT INTO batch_trainers (batch_id, trainer_id)
            VALUES (${batchId}, ${tid})
            ON CONFLICT (batch_id, trainer_id) DO NOTHING
          `;
        }
      }

      if (Array.isArray(studentIds) && studentIds.length) {
        for (const sid of studentIds) {
          await trx`
            INSERT INTO batch_students (batch_id, student_id)
            VALUES (${batchId}, ${sid})
            ON CONFLICT (batch_id, student_id) DO NOTHING
          `;
        }
      }

      return batchId;
    });

    return NextResponse.json({ id: result, success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create batch' }, { status: 500 });
  }
}

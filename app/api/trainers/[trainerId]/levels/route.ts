import { NextRequest, NextResponse } from 'next/server';
import { getDb, sql } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ensureAssignmentsSchema } from '@/lib/assignments-schema';
import { ensureLevelsSchema } from '@/lib/levels-schema';

export const dynamic = 'force-dynamic';

async function verifyTrainerBelongsToOrg(trainerId: string) {
  const db = getDb();
  const { orgId } = await auth();
  if (!orgId) return { error: 'Organization not selected', status: 401 } as const;
  const schoolRow = await db.get<{ id: string }>(`SELECT id FROM schools WHERE clerk_org_id = $1`, [orgId]);
  if (!schoolRow?.id) return { error: 'No school bound to this organization', status: 403 } as const;
  const trainer = await db.get<{ id: string }>(`SELECT id FROM trainers WHERE id = $1 AND school_id = $2`, [trainerId, schoolRow.id]);
  if (!trainer?.id) return { error: 'Trainer not found', status: 404 } as const;
  return { schoolId: schoolRow.id } as const;
}

async function ensureCoordinatorForSchool(schoolId: string) {
  const db = getDb();
  const { userId } = await auth();
  if (!userId) return { error: 'Not authenticated', status: 401 } as const;
  const row = await db.get<{ id: string }>(
    `SELECT id FROM coordinators WHERE school_id = $1 AND clerk_user_id = $2`,
    [schoolId, userId]
  );
  if (!row?.id) return { error: 'Only coordinators can modify assignments', status: 403 } as const;
  return {} as const;
}

// GET /api/trainers/:trainerId/levels
export async function GET(_req: NextRequest, { params }: { params: { trainerId: string } }) {
  await ensureLevelsSchema();
  await ensureAssignmentsSchema();
  const check = await verifyTrainerBelongsToOrg(params.trainerId);
  if ('error' in check) return NextResponse.json({ error: check.error }, { status: check.status });
  const db = getDb();
  const rows = await db.all(
    `SELECT l.*
     FROM trainer_level_assignments tla
     JOIN levels l ON l.id = tla.level_id
     WHERE tla.trainer_id = $1 AND tla.active = TRUE
     ORDER BY l.level_order ASC, l.name ASC`,
    [params.trainerId]
  );
  return NextResponse.json(rows);
}

// POST /api/trainers/:trainerId/levels { level_id }
export async function POST(req: NextRequest, { params }: { params: { trainerId: string } }) {
  await ensureLevelsSchema();
  await ensureAssignmentsSchema();
  const check = await verifyTrainerBelongsToOrg(params.trainerId);
  if ('error' in check) return NextResponse.json({ error: check.error }, { status: check.status });
  const perm = await ensureCoordinatorForSchool(check.schoolId);
  if ('error' in perm) return NextResponse.json({ error: perm.error }, { status: perm.status });

  try {
    const body = await req.json();
    const levelId = Number(body.level_id);
    if (!Number.isFinite(levelId)) return NextResponse.json({ error: 'level_id is required' }, { status: 400 });

    await sql.begin(async (trx) => {
      const upd = await trx`
        UPDATE trainer_level_assignments
        SET active = TRUE, assigned_at = NOW()
        WHERE trainer_id = ${params.trainerId} AND level_id = ${levelId}
        RETURNING id
      `;
      if (!upd?.[0]?.id) {
        await trx`
          INSERT INTO trainer_level_assignments (trainer_id, level_id, assigned_by, active)
          VALUES (${params.trainerId}, ${levelId}, 'coordinator', TRUE)
        `;
      }
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to assign level to trainer' }, { status: 500 });
  }
}

// DELETE /api/trainers/:trainerId/levels?level_id=123
export async function DELETE(req: NextRequest, { params }: { params: { trainerId: string } }) {
  await ensureLevelsSchema();
  await ensureAssignmentsSchema();
  const check = await verifyTrainerBelongsToOrg(params.trainerId);
  if ('error' in check) return NextResponse.json({ error: check.error }, { status: check.status });
  const perm = await ensureCoordinatorForSchool(check.schoolId);
  if ('error' in perm) return NextResponse.json({ error: perm.error }, { status: perm.status });

  const { searchParams } = new URL(req.url);
  const levelId = Number(searchParams.get('level_id'));
  if (!Number.isFinite(levelId)) return NextResponse.json({ error: 'level_id is required' }, { status: 400 });

  await sql`
    UPDATE trainer_level_assignments
    SET active = FALSE
    WHERE trainer_id = ${params.trainerId} AND level_id = ${levelId}
  `;
  return NextResponse.json({ success: true });
}

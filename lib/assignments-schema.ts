import { getDb, sql } from "./db";
import { ensureLevelsSchema } from "./levels-schema";

export async function ensureAssignmentsSchema() {
  // Ensure base tables exist
  await ensureLevelsSchema();
  const db = await getDb();

  // Trainer-level assignments
  await sql`
    CREATE TABLE IF NOT EXISTS trainer_level_assignments (
      id SERIAL PRIMARY KEY,
      trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
      level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
      assigned_by TEXT,
      assigned_at TIMESTAMPTZ DEFAULT NOW(),
      active BOOLEAN DEFAULT TRUE
    );
  `;
  // Unique active pair (partial unique index)
  try {
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS uniq_trainer_level_active ON trainer_level_assignments (trainer_id, level_id) WHERE active`;
  } catch {}
  try {
    await db.run(`CREATE INDEX IF NOT EXISTS idx_tla_trainer ON trainer_level_assignments(trainer_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_tla_level ON trainer_level_assignments(level_id)`);
  } catch {}

  // Batch-level assignments
  await sql`
    CREATE TABLE IF NOT EXISTS batch_level_assignments (
      id SERIAL PRIMARY KEY,
      batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
      level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
      assigned_by TEXT,
      assigned_at TIMESTAMPTZ DEFAULT NOW(),
      active BOOLEAN DEFAULT TRUE
    );
  `;
  try {
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS uniq_batch_level_active ON batch_level_assignments (batch_id, level_id) WHERE active`;
  } catch {}
  try {
    await db.run(`CREATE INDEX IF NOT EXISTS idx_bla_batch ON batch_level_assignments(batch_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_bla_level ON batch_level_assignments(level_id)`);
  } catch {}
}

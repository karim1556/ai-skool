import { getDb } from "./db";

export async function ensureLevelsSchema() {
  const db = await getDb();
  await db.run(`
    CREATE TABLE IF NOT EXISTS levels (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      level_order INTEGER DEFAULT 1,
      description TEXT DEFAULT '',
      thumbnail TEXT DEFAULT '',
      is_free BOOLEAN DEFAULT false,
      price NUMERIC(10,2),
      original_price NUMERIC(10,2),
      subtitle TEXT DEFAULT '',
      who_is_this_for TEXT DEFAULT '',
      what_you_will_learn TEXT DEFAULT '',
      prerequisites TEXT DEFAULT '',
      included_courses_note TEXT DEFAULT '',
      estimated_duration TEXT DEFAULT '',
      language TEXT DEFAULT '',
      meta_keywords TEXT DEFAULT '',
      meta_description TEXT DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // Ensure columns exist if table was created earlier
  await db.run(`ALTER TABLE levels ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;`);
  await db.run(`ALTER TABLE levels ADD COLUMN IF NOT EXISTS price NUMERIC(10,2);`);
  await db.run(`ALTER TABLE levels ADD COLUMN IF NOT EXISTS original_price NUMERIC(10,2);`);
  await db.run(`ALTER TABLE levels ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT '';`);
  await db.run(`ALTER TABLE levels ADD COLUMN IF NOT EXISTS who_is_this_for TEXT DEFAULT '';`);
  await db.run(`ALTER TABLE levels ADD COLUMN IF NOT EXISTS what_you_will_learn TEXT DEFAULT '';`);
  await db.run(`ALTER TABLE levels ADD COLUMN IF NOT EXISTS prerequisites TEXT DEFAULT '';`);
  await db.run(`ALTER TABLE levels ADD COLUMN IF NOT EXISTS included_courses_note TEXT DEFAULT '';`);
  await db.run(`ALTER TABLE levels ADD COLUMN IF NOT EXISTS estimated_duration TEXT DEFAULT '';`);
  await db.run(`ALTER TABLE levels ADD COLUMN IF NOT EXISTS language TEXT DEFAULT '';`);

  await db.run(`
    CREATE TABLE IF NOT EXISTS level_courses (
      level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL,
      PRIMARY KEY (level_id, course_id)
    );
  `);

  await db.run(`CREATE INDEX IF NOT EXISTS idx_levels_category ON levels(category);`);
  await db.run(`CREATE INDEX IF NOT EXISTS idx_levels_order ON levels(level_order);`);

  // Seed default three levels if table is empty
  const countRow = await db.get<{ count: string }>(`SELECT COUNT(*)::text as count FROM levels`);
  const count = Number(countRow?.count || '0');
  if (count === 0) {
    await db.run(
      `INSERT INTO levels (name, category, level_order, description)
       VALUES ($1,$2,$3,$4), ($5,$6,$7,$8), ($9,$10,$11,$12)`,
      [
        'Level 1', 'General', 1, 'Introductory level',
        'Level 2', 'General', 2, 'Intermediate level',
        'Level 3', 'General', 3, 'Advanced level',
      ]
    );
  }
}

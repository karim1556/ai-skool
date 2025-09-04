/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

async function main() {
  const url = process.env.POSTGRES_URL;
  if (!url) {
    console.error('ERROR: POSTGRES_URL environment variable is not set.');
    process.exit(1);
  }
  const sql = postgres(url, { prepare: false, ssl: 'require' });

  const migDir = path.join(__dirname, '..', 'migrations');
  const files = fs
    .readdirSync(migDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('No SQL migration files found in migrations/.');
    process.exit(0);
  }

  console.log('Running migrations on', new URL(url).hostname, 'with', files.length, 'files...');

  try {
    await sql`BEGIN`;
    for (const file of files) {
      const full = path.join(migDir, file);
      const sqlText = fs.readFileSync(full, 'utf8');
      console.log(`Applying: ${file}`);
      await sql.unsafe(sqlText);
    }
    await sql`COMMIT`;
    console.log('Migrations applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    try { await sql`ROLLBACK`; } catch {}
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main();

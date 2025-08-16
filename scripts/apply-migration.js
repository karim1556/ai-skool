const fs = require('fs');
const path = require('path');
const postgres = require('postgres');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

async function applyMigration() {
  const migrationFile = '0003_create_quiz_question_tables.sql';
  const migrationFilePath = path.join(__dirname, '../migrations', migrationFile);

  if (!process.env.POSTGRES_URL) {
    console.error('Error: POSTGRES_URL environment variable not found.');
    process.exit(1);
  }

  const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

  try {
    console.log(`Applying migration: ${migrationFile}...`);
    const migrationSQL = fs.readFileSync(migrationFilePath, 'utf8');
    await sql.unsafe(migrationSQL);
    console.log('Migration applied successfully.');
  } catch (error) {
    console.error('Failed to apply migration:', error);
  } finally {
    await sql.end();
  }
}

applyMigration();

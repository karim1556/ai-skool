import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { Pool } from 'pg';

// This interface defines a common shape for our database object, 
// whether it's SQLite or PostgreSQL, to ensure type safety.
interface AppDb {
  get<T>(sql: string, params?: any[]): Promise<T | undefined>;
  all<T>(sql: string, params?: any[]): Promise<T[]>;
  run(sql: string, params?: any[]): Promise<any>;
  exec(sql: string): Promise<any>;
}

// Use a global variable to cache the database connection.
// This prevents creating a new connection on every hot-reload in development.
declare global {
  var db_connection: AppDb | undefined;
}

// This function replaces SQLite's '?' placeholders with PostgreSQL's '$1', '$2', etc.
const toPgSql = (sql: string) => {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
};

async function getDb(): Promise<AppDb> {
  // If a connection is already cached, return it.
  if (global.db_connection) {
    return global.db_connection;
  }

  // For production (Vercel), connect to Supabase (PostgreSQL).
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required for Vercel to connect to Supabase
      },
    });

    // Create a PostgreSQL client that mimics the sqlite API for compatibility.
    const pgDb: AppDb = {
      get: async (sql, params = []) => {
        const { rows } = await pool.query(toPgSql(sql), params);
        return rows[0];
      },
      all: async (sql, params = []) => {
        const { rows } = await pool.query(toPgSql(sql), params);
        return rows;
      },
      run: async (sql, params = []) => pool.query(toPgSql(sql), params),
      exec: async (sql) => pool.query(sql),
    };

    global.db_connection = pgDb;
    return pgDb;
  }

  // For development, connect to the local SQLite database.
  const sqliteDb: Database = await open({
    filename: './lms.db', // The local database file
    driver: sqlite3.Database,
  });

  global.db_connection = sqliteDb as AppDb;
  return global.db_connection;
}

export { getDb };
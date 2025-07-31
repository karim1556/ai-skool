
import { sql } from '@vercel/postgres';
import { Pool } from 'pg';

// Database connection pool
let pool: Pool | null = null;

// Database interface to maintain compatibility with existing code
interface DatabaseInterface {
  get(query: string, params?: any[]): Promise<any>;
  all(query: string, params?: any[]): Promise<any[]>;
  run(query: string, params?: any[]): Promise<{ changes: number; lastInsertRowid?: number }>;
  exec(query: string): Promise<void>;
  close(): Promise<void>;
}

class PostgresDatabase implements DatabaseInterface {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async get(query: string, params: any[] = []): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async all(query: string, params: any[] = []): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async run(query: string, params: any[] = []): Promise<{ changes: number; lastInsertRowid?: number }> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return {
        changes: result.rowCount || 0,
        lastInsertRowid: result.rows[0]?.id || undefined
      };
    } finally {
      client.release();
    }
  }

  async exec(query: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(query);
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

let db: DatabaseInterface | null = null;

export async function getDb(): Promise<DatabaseInterface> {
  if (!db) {
    try {
      // Use the same pg Pool for both development and production
      if (!pool) {
        console.log(`Connecting to database in ${process.env.NODE_ENV} mode...`);
        // Diagnostic log to verify the database host
        const dbHost = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).host : 'DATABASE_URL not set';
        console.log(`VERCEL IS CONNECTING TO DATABASE HOST: ${dbHost}`);

        pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false
          }
        });
      }
      db = new PostgresDatabase(pool);
      
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }
  
  return db;
}


// Initialize database schema if needed
export async function initializeDatabase() {
  const database = await getDb();
  
  try {
    // Check if tables exist by querying information_schema
    const tablesExist = await database.get(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'courses'
    `);
    
    if (!tablesExist || tablesExist.count === 0) {
      console.log('Database schema needs to be initialized via migration scripts');
      // Schema should be created via the SQL scripts in the scripts/ directory
      // or through Vercel Postgres dashboard
    }
  } catch (error) {
    console.error('Error checking database schema:', error);
  }
}

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
      // Use Vercel Postgres in production, local PostgreSQL in development
      if (process.env.NODE_ENV === 'production') {
        console.log('Connecting to Vercel Postgres...');
        
        // For Vercel Postgres, we'll use the sql template function
        // Create a wrapper that implements our interface
        db = {
          async get(query: string, params: any[] = []) {
            const result = await sql.query(query, params);
            return result.rows[0] || null;
          },
          async all(query: string, params: any[] = []) {
            const result = await sql.query(query, params);
            return result.rows;
          },
          async run(query: string, params: any[] = []) {
            const result = await sql.query(query, params);
            return {
              changes: result.rowCount || 0,
              lastInsertRowid: result.rows[0]?.id || undefined
            };
          },
          async exec(query: string) {
            await sql.query(query);
          },
          async close() {
            // Vercel Postgres handles connection pooling automatically
          }
        };
      } else {
        console.log('Connecting to local PostgreSQL...');
        
        // For local development, use pg Pool
        if (!pool) {
          pool = new Pool({
            connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/lms_dev',
            ssl: false
          });
        }
        
        db = new PostgresDatabase(pool);
      }
      
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
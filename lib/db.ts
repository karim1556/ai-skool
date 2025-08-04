import postgres from 'postgres';

// Define the interface for our database operations for better compatibility.
interface Database {
  get<T>(query: string, params?: any[]): Promise<T | null>;
  all<T>(query: string, params?: any[]): Promise<T[]>;
  run(query: string, params?: any[]): Promise<void>;
}

// The 'postgres' library automatically handles connection pooling.
// We create a single, shared instance of the client.
const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set.');
}

const sql = postgres(connectionString, {
  prepare: false,
  ssl: 'require',
});

console.log('Postgres client initialized.');

// This is our singleton database object.
const db: Database = {
  async get<T>(query: string, params: any[] = []): Promise<T | null> {
    const rows = await sql.unsafe(query, params);
    return (rows[0] as unknown as T) || null;
  },

  async all<T>(query: string, params: any[] = []): Promise<T[]> {
    const rows = await sql.unsafe(query, params);
    return rows as unknown as T[];
  },

  async run(query: string, params: any[] = []): Promise<void> {
    await sql.unsafe(query, params);
  },
};

/**
 * Returns a shared instance of the database connection.
 * In a serverless environment, this allows connection reuse across function invocations.
 */
export function getDb(): Database {
  return db;
}

// Export the raw sql client for transactions or advanced features
export { sql };

// Note: There is no closeDb function. The 'postgres' library manages the connection
// lifecycle automatically. You do not need to manually close the connection.
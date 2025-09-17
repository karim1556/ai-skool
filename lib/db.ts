import postgres from 'postgres';

// Define the interface for our database operations for better compatibility.
export interface Database {
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
  max: 5,               // limit pool size to avoid local exhaustion
  idle_timeout: 20,     // seconds
  connect_timeout: 10,  // seconds
});

console.log('Postgres client initialized.');

// Simple retry wrapper for transient errors
async function withRetry<T>(fn: () => Promise<T>, attempts = 2): Promise<T> {
  let lastErr: any
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err: any) {
      lastErr = err
      const code = err?.code
      // retry on common transient conditions
      const transient = code === 'XX000' /* pool timeout */
        || code === '57014' /* statement timeout */
        || code === '57P01' /* admin shutdown */
        || code === 'ECONNRESET'
        || /timeout/i.test(String(err?.message || ''))
      if (!transient || i === attempts - 1) throw err
      // small backoff
      await new Promise((r) => setTimeout(r, 250 * (i + 1)))
    }
  }
  throw lastErr
}

// This is our singleton database object.
const db: Database = {
  async get<T>(query: string, params: any[] = []): Promise<T | null> {
    const rows = await withRetry(() => sql.unsafe(query, params))
    return (rows[0] as unknown as T) || null
  },
  async all<T>(query: string, params: any[] = []): Promise<T[]> {
    const rows = await withRetry(() => sql.unsafe(query, params))
    return rows as unknown as T[]
  },
  async run(query: string, params: any[] = []): Promise<void> {
    await withRetry(() => sql.unsafe(query, params))
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
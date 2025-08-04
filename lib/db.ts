import postgres from 'postgres';

// Define the interface for our database operations
interface Database {
  get(query: string, params: any[]): Promise<any | null>;
  all(query: string, params: any[]): Promise<any[]>;
  run(query: string, params: any[]): Promise<void>;
  close(): Promise<void>;
}

// Create a singleton instance of the postgres client
// The 'postgres' library automatically handles connection pooling
let sql: postgres.Sql<Record<string, postgres.PostgresType>> | null = null;

function getClient() {
  if (!sql) {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL environment variable is not set.');
    }

    console.log('Initializing postgres client...');
    // The 'postgres' library handles SSL and other Supabase-specific settings automatically
    // when connecting to a Supabase URL.
    sql = postgres(connectionString, {
      // Prepared statements are disabled by default with Supabase URLs ending in :6543
      // but we can be explicit if needed.
      prepare: false,
      ssl: 'require'
    });
    console.log('Postgres client initialized.');
  }
  return sql;
}

// PostgresDatabase class that implements the Database interface using 'postgres'
class PostgresJsDatabase implements Database {
  private client: postgres.Sql<Record<string, postgres.PostgresType>>;

  constructor() {
    this.client = getClient();
  }

  private async executeQuery(query: string, params: any[]): Promise<any[]> {
      // The 'postgres' library uses tagged templates for queries, but it also supports
      // the standard (query, params) format using sql.unsafe for compatibility.
      // However, a more direct way is to use sql(query, ...params) but that requires
      // the query to have placeholders like $1, $2.
      // Let's stick to a compatible API.
      return this.client.unsafe(query, params).values();
  }

  async get(query: string, params: any[] = []): Promise<any | null> {
    const rows = await this.client.unsafe(query, params);
    return rows[0] || null;
  }

  async all(query: string, params: any[] = []): Promise<any[]> {
    const rows = await this.client.unsafe(query, params);
    return Array.from(rows);
  }

  async run(query: string, params: any[] = []): Promise<void> {
    await this.client.unsafe(query, params);
  }

  async close(): Promise<void> {
    await this.client.end();
    sql = null; // Allow re-initialization
  }
}

// Singleton instance of the database
let db: Database | null = null;

// getDb function to initialize and/or return the database instance
export async function getDb(): Promise<Database> {
  if (!db) {
    try {
      db = new PostgresJsDatabase();
      console.log('Database connection wrapper initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize database connection wrapper:', error);
      db = null; // Reset on failure
      throw error;
    }
  }
  return db;
}

// closeDb function to gracefully close the database connection
export async function closeDb(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
    console.log('Database connection closed.');
  }
}
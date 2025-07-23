# Vercel Deployment Guide for SQLite-based Applications

## Current Implementation

This application uses SQLite as its database. For Vercel deployment, we've implemented the following approach:

1. **In-memory SQLite Database in Production**: When running in production (Vercel), the application uses an in-memory SQLite database (`:memory:`) instead of a file-based database.

2. **Dual SQLite Implementation**: The application attempts to use `better-sqlite3` first, and falls back to `sqlite3` if needed, to maximize compatibility with the serverless environment.

3. **Next.js Configuration**: We've configured Next.js to properly handle SQLite in a serverless environment by:
   - Adding SQLite packages to `serverComponentsExternalPackages`
   - Excluding native dependencies from bundling
   - Marking SQLite packages as external in webpack configuration

4. **Dynamic API Routes**: All API routes use `export const dynamic = 'force-dynamic';` to prevent build-time database access.

## Important Limitations

### Data Persistence

The in-memory SQLite database **does not persist data between function invocations** in a serverless environment. This means:

- Each time a serverless function is invoked, a new in-memory database is created
- The database is initialized with schema and sample data on each cold start
- Any data written during one function invocation will be lost when the function completes

### Use Cases

This implementation is suitable for:

- Read-only applications where data doesn't change frequently
- Applications where data can be pre-loaded during deployment
- Development and testing environments
- Demonstration purposes

It is **not suitable** for:

- Applications that need to persist user-generated data
- Applications with frequent write operations
- Production applications that require data consistency

## Recommended Alternatives for Production

For a production environment on Vercel, consider migrating to one of these serverless-compatible database solutions:

1. **Vercel Postgres**: A serverless SQL database designed to integrate with Vercel Functions
2. **Vercel KV**: A Redis-compatible key-value database for Vercel
3. **Supabase**: An open-source Firebase alternative with PostgreSQL database
4. **PlanetScale**: A serverless MySQL-compatible database platform
5. **MongoDB Atlas**: A cloud-hosted MongoDB service with serverless capabilities

## Migration Path

To migrate from SQLite to a serverless-compatible database:

1. Choose a database service that fits your application's needs
2. Update database connection code to use the new service
3. Create migration scripts to transfer schema and data
4. Update API routes to use the new database client
5. Test thoroughly before deploying to production

## Troubleshooting

If you encounter issues with SQLite on Vercel:

1. Check Vercel build logs for specific errors
2. Ensure all API routes have `export const dynamic = 'force-dynamic';`
3. Verify that Next.js configuration properly handles SQLite packages
4. Consider using the read-only approach mentioned in the Hacker News comment (building and deploying the application bundled with the data)

Remember that SQLite is fundamentally not designed for serverless environments, so these workarounds have inherent limitations.
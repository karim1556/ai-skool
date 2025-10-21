# Supabase: Projects table and deployment notes

This project supports persisting student projects to Supabase. By default the app will fall back
to `data/projects.json` when Supabase environment variables are not set (useful for local dev).

Follow these steps to enable persistence on your deployed app (Vercel):

1. Create a Supabase project at https://app.supabase.com
2. Open the SQL editor and run the migration SQL found in `migrations/20251021_create_projects_table.sql`.
3. In your Supabase project, go to Settings -> API and copy the `URL` and a `Service Role Key`.
   - For server-only operations use `SUPABASE_SERVICE_ROLE_KEY` (recommended).
   - You can also use an anon key (`SUPABASE_ANON_KEY`) but prefer service role for server-side writes.
4. In Vercel (or your deployment platform) set the following environment variables for the production deployment:
   - SUPABASE_URL = <your-supabase-url>
   - SUPABASE_SERVICE_ROLE_KEY = <your-service-role-key>

Local development:
- You can set these env vars in a `.env.local` file at the repo root for local testing:

  SUPABASE_URL=https://xyzcompany.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

Notes:
- The API expects a `projects` table matching the columns in the migration. The server code will
  insert/update/delete rows directly; adjust columns if your admin pages send additional fields.
- If Supabase is not configured, the app writes to `data/projects.json` (dev fallback). On Vercel this
  file is ephemeral — set the env vars to persist changes.

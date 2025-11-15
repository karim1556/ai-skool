## AI-Skool — README

## Quick summary

- Framework: Next.js (App Router)
- Language: TypeScript + React
- Auth: Clerk
- Primary data: Supabase (Postgres + Storage) — but the code can also talk directly to Postgres via `postgres`.

Recommended runtime: Node 18.x or 20.x. I use pnpm here (there's a `pnpm-lock.yaml`).

---

## Getting started (local dev)

1. Install dependencies

```bash
pnpm install
```

2. Create a local env file for development

Create `.env.local` in the repo root and add the minimal keys you need for local work (examples below). For quick dev without Supabase you can still run the site — some features will fall back to local JSON files.

3. Start the dev server

```bash
pnpm run dev
# then open http://localhost:3000
```

If you want full parity with the cloud (Auth + Storage + Postgres), follow the Local Supabase instructions further down.

---

## Scripts I use daily

- `pnpm run dev` — development server
- `pnpm run build` — production build
- `pnpm start` — run production server after build
- `pnpm run seed:camps` — seed camps data into Supabase (needs SUPABASE envs)
- `pnpm run lint` — run linter

If you need a single command to start everything in dev (db + app) let me know and I’ll add a `Makefile` or npm script for it.

---

## Local Supabase (recommended when you need Auth + Storage + Postgres)

This is the route I take when I need to test auth flows or storage uploads locally.

1. Install the Supabase CLI (macOS/Homebrew)

```bash
brew tap supabase/cli
brew install supabase/tap/supabase
```

Alternative (npm):

```bash
npm install -g supabase
```

2. Initialize and start Supabase in this repo

```bash
cd /path/to/repo
supabase init    # creates .supabase/ and a docker-compose
supabase start   # starts Postgres + Auth + Storage + Realtime locally
```

The CLI prints the local URLs and keys (anon key + service_role key). Copy those values into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-cli>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-from-cli>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Seed the demos (optional)

```bash
# ensure the env vars are loaded (or put them in .env.local)
pnpm run seed:camps
```

4. Stop the local Supabase

```bash
supabase stop
```

Notes
- The Supabase local stack runs in Docker and keeps data in volumes. Use `supabase db reset` if you want a clean slate.
- If you need the exact cloud dataset locally, do a `pg_dump` from your cloud DB and `pg_restore` into the local container.

---

## Lightweight option: local Postgres only

If you only need the database (no Supabase Auth/Storage), this is faster and uses less RAM.

1. Start Postgres with Docker

```bash
docker run --name ai-skool-local-db -e POSTGRES_PASSWORD=example -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:15
```

2. Point the app at the DB

Add to `.env.local`:

```env
POSTGRES_URL=postgres://postgres:example@localhost:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Run migrations (scripts exist in `/scripts` and `migrations/`)

```bash
# example migration runner included in the repo
node ./scripts/run-migrations.js
```

4. Seed DB if you have SQL seeds or adapt the JS seeds to use POSTGRES only.

---

## Environment variables (complete list I use locally / in prod)

Set these on your host or in `.env.local` for local dev. NEVER commit real values.

# Database / Supabase
POSTGRES_URL                # postgres connection string used by lib/db.ts
SUPABASE_URL                # or NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY   # server-only (dangerous if leaked)
SUPABASE_ANON_KEY           # client anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
SUPABASE_JWT_SECRET

# Clerk (auth)
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
CLERK_WEBHOOK_SECRET

# Email
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_FROM

# App
NEXT_PUBLIC_APP_URL

Optional: POSTGRES_URL_NON_POOLING, POSTGRES_PRISMA_URL, CLERK_STUDENT_ROLE, SVIX_*

If you want, I can add a `.env.example` file that lists these keys with short notes.

---

## Deployment checklist

1. Use Node 18.x or 20.x. Prefer pnpm on the host.
2. Add environment variables to the host’s secret store (do not commit `.env`).
3. Run `pnpm install` then `pnpm run build` and `pnpm start`.
4. If you depend on Supabase server features (uploads, server-side queries), make sure `SUPABASE_SERVICE_ROLE_KEY` is only available to server runtime.

Vercel notes: this project works on Vercel. Add the env vars under Project Settings. If you want, I can add a `vercel.json` with recommended settings.

---

## Troubleshooting & tips

- If auth pages behave oddly, check the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` values.
- If the app returns DB errors, confirm `POSTGRES_URL` (or Supabase keys) are correct and that the DB allows connections from the host.
- For upload/storage issues: confirm `SUPABASE_SERVICE_ROLE_KEY` and bucket permissions.
- To reset local Supabase: `supabase db reset` (destroys local data).

---

## Useful commands summary

```bash
# install deps
pnpm install

# dev
pnpm run dev

# build
pnpm run build
pnpm start

# seed (requires SUPABASE envs)
pnpm run seed:camps
```

---




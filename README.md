# AI-Skool — README

This document provides a concise guide for provisioning, running, and hosting the AI-Skool web application (Next.js). It's intended for Ops / Hosting engineers who need dependency info, environment variables, and quick run/build instructions.

## Project overview

- Framework: Next.js (app router)
- Language: TypeScript + React
- Purpose: Learning/courses/camps web app with Supabase and Clerk integrations

## Prerequisites

- Node: Use a modern LTS version. Recommended: Node 18.x (safe) or Node 20.x.
- Package manager: pnpm (the repo contains `pnpm-lock.yaml`). Use `pnpm` on the host.

## Install

```bash
# from repo root
pnpm install
```

## Important npm scripts

- `pnpm run dev` — run development server (Next.js dev)
- `pnpm run build` — build for production (Next build)
- `pnpm start` — start production server (Next start)
- `pnpm run seed:camps` — seeds camps data to Supabase (requires SUPABASE_* envs)
- `pnpm run lint` — run linter (next lint)

## Key dependencies (high level)

Main runtime libraries in this project include:
- Next.js (`next`)
- React / React DOM
- Clerk (`@clerk/nextjs`) for authentication
- Supabase (`@supabase/supabase-js`) for projects, storage, and auth-backed data
- postgres (node postgres client) for direct Postgres access
- svix for webhook handling
- nodemailer for SMTP email delivery
- TailwindCSS + PostCSS for styles

(See `package.json` for the full package+version list.)

## Required environment variables

Core environment variables the host must provide (do NOT commit secrets). Provide these via the hosting platform's secret store.

- Database / Supabase
  - `POSTGRES_URL` — main Postgres connection string used by `lib/db.ts` (or use Supabase URLs below)
  - `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) — Supabase project URL
  - `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server operations)
  - `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client anon key (if exposing client features)
  - `SUPABASE_JWT_SECRET` — optional, used in scripts

- Clerk (auth)
  - `CLERK_SECRET_KEY` — Clerk server secret
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key used in the client
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL` — routing config
  - `CLERK_WEBHOOK_SECRET` — if using Clerk webhooks

- Email (SMTP / fallback)
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `SMTP_FROM`

- App / host
  - `NEXT_PUBLIC_APP_URL` — public URL for the app (used in links)
  - Any other `NEXT_PUBLIC_*` keys required by integrations

- Optional / advanced
  - `POSTGRES_URL_NON_POOLING`, `POSTGRES_PRISMA_URL` — used by some scripts
  - `CLERK_STUDENT_ROLE` — role constants used by the app
  - `SVIX_*` — if svix is used for outbound webhooks

Note: The repository contains a `.env` file (local development). Move those values into the host secrets and remove `.env` from deployment if necessary.

## Deployment notes

- Use the hosting provider's Node 18/20 runtime and set environment variables in the platform settings.
- For Vercel: the project is compatible with Vercel; enable the necessary environment variables in the project settings. See `VERCEL_DEPLOYMENT.md` for notes.
- For self-hosted servers: provide `POSTGRES_URL` or configure Supabase, run `pnpm install`, `pnpm run build`, then `pnpm start`.
- If the app uses server-side Supabase features, ensure `SUPABASE_SERVICE_ROLE_KEY` is kept secret and only available in server runtime.

## Running locally (dev)

```bash
pnpm install
pnpm run dev
# open http://localhost:3000
```

## Production build & run

```bash
pnpm install --prod
pnpm run build
pnpm start
```

(Or rely on your host to run build/start automatically in deployments.)

## Seeding data

To seed camps into Supabase (only if Supabase envs are set):

```bash
pnpm run seed:camps
```

## Security & secrets

- Do NOT commit `.env` with real credentials to any public repo.
- Use the host's secret store for `POSTGRES_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CLERK_SECRET_KEY`, SMTP creds, etc.
- `SUPABASE_SERVICE_ROLE_KEY` and `CLERK_SECRET_KEY` are high-privilege secrets.



# 🌟 AI-Skool — README

<p align="center">
  <img src="./assets/banner.png" alt="AI-Skool Banner" width="800" />
</p>

<p align="center">
  <h1 align="center">AI-Skool</h1>
  <p align="center">A Modern Full-Stack Learning Platform • Next.js • Supabase • Clerk • TypeScript</p>
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-5A67D8?style=for-the-badge&logo=clerk&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

</p>

---

# 📚 Table of Contents

- [🚀 Quick Summary](#-quick-summary)
- [🛠️ Getting Started (Local Development)](#️-getting-started-local-development)
- [⚡ Daily Scripts](#-daily-scripts)
- [🐘 Local Supabase Setup](#-local-supabase-setup)
- [🪶 Lightweight: Local Postgres Only](#-lightweight-local-postgres-only)
- [🔑 Environment Variables](#-environment-variables)
- [🚢 Deployment Checklist](#-deployment-checklist)
- [🧩 Troubleshooting](#-troubleshooting)
- [📸 Screenshots](#-screenshots)
- [🗺️ Architecture Diagram](#️-architecture-diagram)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [📚 Commands Summary](#-commands-summary)

---

# 🚀 Quick Summary

- **Framework:** Next.js (App Router)
- **Language:** TypeScript + React
- **Auth:** Clerk
- **Database/Storage:** Supabase (Postgres + Storage)
  > Can also connect directly to Postgres via `postgres`

**Recommended Node version:** 18.x or 20.x  
Package manager: **pnpm**

---

# 🛠️ Getting Started (Local Development)

### 1. Install dependencies
```bash
pnpm install
```

### 2. Create `.env.local`
Include only the variables you need.  
App still works without Supabase (uses fallback JSON).

### 3. Start the app
```bash
pnpm run dev
```
Visit → http://localhost:3000

---

# ⚡ Daily Scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Production build |
| `pnpm start` | Run built app |
| `pnpm run seed:camps` | Seed Supabase with demo data |
| `pnpm run lint` | Run ESLint |

---

# 🐘 Local Supabase Setup

Perfect for testing authentication, RLS, storage, and real Postgres locally.

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Start Supabase
```bash
supabase init
supabase start
```

Add generated keys to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Seed data
```bash
pnpm run seed:camps
```

### 4. Stop Supabase
```bash
supabase stop
```

---

# 🪶 Lightweight: Local Postgres Only

### 1. Start Postgres
```bash
docker run --name ai-skool-local-db \
  -e POSTGRES_PASSWORD=example \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Add to `.env.local`
```env
POSTGRES_URL=postgres://postgres:example@localhost:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run migrations
```bash
node ./scripts/run-migrations.js
```

---

# 🔑 Environment Variables

### Database / Supabase
```
POSTGRES_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY
SUPABASE_JWT_SECRET
```

### Clerk
```
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
CLERK_WEBHOOK_SECRET
```

### Email
```
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_FROM
```

### App
```
NEXT_PUBLIC_APP_URL
```

Optional:
```
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
CLERK_STUDENT_ROLE
SVIX_*
```

---

# 🚢 Deployment Checklist

✔ Node 18 or 20  
✔ All env variables added  
✔ Build & start
```bash
pnpm install
pnpm run build
pnpm start
```
✔ Keep service role key server-only

Works great on **Vercel**.

---

# 🧩 Troubleshooting

- ❗ Auth issues → Check Clerk keys  
- ❗ DB errors → Validate Postgres / Supabase URLs  
- ❗ Storage issues → Check bucket permission + service key  
- ❗ Reset local Supabase →
```bash
supabase db reset
```

---

# 📸 Screenshots (Placeholders)

| Home | Dashboard | Profile |
|------|-----------|---------|
| ![](./screens/home.png) | ![](./screens/dashboard.png) | ![](./screens/profile.png) |

---

# 🗺️ Architecture Diagram
```
User → Clerk Auth → Next.js (App Router)
                ↓
        Supabase (DB + Storage)
                ↓
          Local/Cloud Runtime
```

---

# 🤝 Contributing

Contributions are welcome!  
Feel free to open issues or submit pull requests.

---

# 📝 License

MIT License — free to use.

---

# 📚 Commands Summary
```bash
pnpm install
pnpm run dev
pnpm run build
pnpm start
pnpm run seed:camps
```

---

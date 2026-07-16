# Portfolio — Vercel Deployment Guide

A cinematic dark-themed portfolio with a lamp entry animation, admin panel, and PostgreSQL backend.

## Quick Deploy (5 minutes)

### 1. Get a free PostgreSQL database

Go to [neon.tech](https://neon.tech) → Sign up → Create project → Copy connection string.

It looks like:
```
postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Portfolio ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Add these **Environment Variables**:

| Name | Value |
|---|---|
| `DATABASE_URL` | `postgresql://...` (from Neon) |
| `ADMIN_PASSWORD` | *(your chosen password)* |
| `SESSION_SECRET` | *(any random string — run `openssl rand -hex 32`)* |

4. Click **Deploy**
5. Wait 2-3 minutes → Done!

### 4. Initialize the database (automatic)

On first visit, the app auto-creates all tables and seeds default content.
No manual database setup needed.

---

## One-Command Deploy (CLI)

If you have the Vercel CLI installed:

```bash
./deploy-vercel.sh
```

This script:
- Checks prerequisites (git, vercel CLI)
- Validates your `.env` has a PostgreSQL URL
- Generates Prisma client
- Pushes schema to your database
- Deploys to Vercel production

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Neon/Vercel Postgres) |
| `ADMIN_PASSWORD` | ✅ | Password for admin panel (set your own) |
| `SESSION_SECRET` | ✅ | Signs admin session cookies (any random string) |

Copy `.env.example` and fill in your values.

---

## Admin Panel

- Click the lock icon in the footer (or press `Ctrl/Cmd + .`)
- Password: *(whatever you set in ADMIN_PASSWORD)*
- Edit profile, projects, services, tech stack, rotating roles
- Changes save to PostgreSQL and persist for all visitors

---

## Local Development

For local dev with SQLite:

1. Run `./setup-local.sh` to create your `.env` and `.env.local`
2. Run `bun run db:push`
3. Run `bun run dev`

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: PostgreSQL (Prisma ORM)
- **Animation**: Framer Motion + GSAP
- **Fonts**: Inter + Poppins

---

## Security

- ✅ `.env` and `.env.local` are gitignored — never uploaded to GitHub
- ✅ No hardcoded passwords in source code
- ✅ `.env.example` contains only placeholder values
- ✅ Database files (`*.db`) are gitignored
- ✅ Admin password comes from environment variables only

---

## Troubleshooting

### Build fails on Vercel
- Ensure `DATABASE_URL` is set in Vercel env vars
- Ensure it's a PostgreSQL URL (not SQLite `file:`)

### Admin password doesn't work
- Check `ADMIN_PASSWORD` is set in `.env.local` (local) or Vercel env vars (production)
- The source code has NO fallback password — it must be set via environment

### Database is empty
- Visit the site once — `ensureSeeded()` auto-populates on first load
- Or run `npx prisma db push` locally with your production DATABASE_URL

### Images not loading
- Images in `/public/images/` deploy with the app
- External images (picsum.photos) are whitelisted in `next.config.ts`

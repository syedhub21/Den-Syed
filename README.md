# Den-Syed × Atelier

Syed's portfolio — the **Atelier** editorial dark design, rebuilt on the
original **Den-Syed** Next.js + Prisma + Admin Panel stack.

- **UI**: Atelier (Bebas Neue / Fraunces / Space Grotesk / JetBrains Mono,
  orange `#ff4d00` accent, custom cursor, loader, mesh + grain, bento
  manifesto, filterable gallery, tech icon marquee, "SAY HELLO" footer)
- **Engine**: the original Den-Syed backend — Next.js 16 App Router,
  TypeScript, Tailwind CSS 4, Prisma, admin panel
- **"Let's Build"**: the interactive **3D robot** (Spline) on a plain black
  backdrop, with the heading in a white → orange → gold gradient
  (`#ffffff → #ff4d00 → #ffd23f`)
- **Hero**: hover-scramble on **both** the big name *and* the italic role
  line (with the RGB split glitch)

---

## Quick start (deploy to Vercel)

1. Push this folder to your GitHub repo (`github.com/syedhub21/Den-Syed`).
2. In Vercel, make sure these **Environment Variables** are set:
   - `DATABASE_URL` — your Neon / Vercel Postgres connection string
   - `ADMIN_PASSWORD` — your admin panel password
   - `SESSION_SECRET` — any random string (`openssl rand -hex 32`)
3. Deploy. `vercel.json` runs `bun run vercel-build`, which generates the
   Prisma client, pushes the schema (`prisma db push`), and builds.
4. Visit the site — the DB seeds itself with default content on first load.
   If it looks empty, hit `/api/setup` once.

> The main `prisma/schema.prisma` is **PostgreSQL** (production).
> For local SQLite dev use `prisma/schema.local.prisma` — see below.
>
> New schema fields (manifesto + Now fields) are added automatically by
> the vercel-build `prisma db push` step.

---

## Admin panel

- Open with **Ctrl/Cmd + .** (or the small **lock icon** at the bottom-left
  of the footer)
- Password = your `ADMIN_PASSWORD` env var
- Tabs:
  - **Profile** — name, roles, bio, email, socials, the **manifesto**
    opening paragraph, the three **Now** entries (Working on / Currently /
    Reading), the **quote card** text + attribution, and the hero/about
    **photos (upload directly — no URLs needed)**
  - **Projects** — the Selected Work gallery, with **image upload** for
    cover images (a URL still works too if you prefer)
  - **Services** — drives the "What I do" list in the bento
  - **Tech Stack** — drives the colorful icon marquee
  - **Stats** — the count-up number cards (Projects Completed, Years
    Experience, …). Add as many as you like; the bento adapts.
  - **Messages** — contact form submissions

### Highlight syntax

In the manifesto and Now fields, wrap words in `*asterisks*` to highlight
them — orange in the manifesto, green in the Now grid.

Everything you edit appears on the site instantly after saving.

## What's wired to the DB

| Section | Source |
|---|---|
| Nav logo / status | `profile.name` / `siteSettings.availabilityText` |
| Hero name + role line + marquee | `profile.name`, `profile.roles`, `profile.rotatingRoles` |
| Hero & about photos | `profile.heroImage`, `profile.aboutImage` |
| Manifesto opener + second paragraph | `profile.manifesto`, `profile.bio` |
| Quote card text + attribution | `profile.quoteText`, `profile.quoteAttribution` |
| Bento stat cards (20+, 2+, …) | `stats` (count-up animation) |
| "What I do" list | `services` |
| Selected work gallery + filters | `projects` (filter = first technology) |
| Let's Build email / LinkedIn | `profile.email`, `profile.linkedin` |
| Tech icon marquee | `techStack` (icons from `public/icons/<icon>.svg`) |
| Now — Working on / Currently / Reading | `profile.nowWorkingOn` / `nowCurrently` / `nowReading` |
| Now / Contact / Footer | `profile` fields |

## Local development (SQLite)

```bash
cp .env.example .env          # set DATABASE_URL="file:./dev.db"
cp prisma/schema.local.prisma prisma/schema.prisma
bun install
bun run db:push
bun run dev
```

Before committing for Vercel again, restore the PostgreSQL schema:

```bash
git checkout prisma/schema.prisma
```

## Image uploads

The admin panel's **Upload image** button (Projects → cover image, Profile →
hero/about photos) sends the file to `POST /api/upload`, which stores it in
the `UploadedImage` table and returns `/api/images/<id>`. That route serves
the bytes with immutable caching.

- Max **2MB** per image; PNG, JPEG, WebP, GIF and SVG supported.
- DB-backed storage means uploads **survive on Vercel** (serverless has a
  read-only filesystem) and live alongside your other data in Neon.
- Uploaded images don't change once stored, so browsers cache them forever —
  no repeated DB hits.

## Contact form

`POST /api/contact` stores messages in the `ContactMessage` table — read
them in the admin panel's **Messages** tab.

## Notes

- The 3D robot streams from Spline (`prod.spline.design` scene) — it mounts
  only when scrolled into view and unmounts when far away to keep scrolling
  smooth. It needs internet access to load.
- The Atelier effects (custom cursor, scramble, RGB split, magnetic
  buttons) are no-ops on touch devices and with reduced-motion enabled.
- Photos live in `public/images/` — `hero-character.png` (hero portrait)
  and `about-character.png` (studio photo). Paths are editable in the
  admin panel.
- Tech icons are simple-icons SVGs in `public/icons/` — the `icon` field in
  the admin Tech Stack tab must match the file name.

# WZM Talent Acquisition Suite — CLAUDE.md

## What This Project Is

A full-stack HR & recruitment website for **WZM Human Resource Solution Co. Ltd**.
It lets visitors browse jobs and submit applications, and gives admin users a dashboard to manage listings and view applicants.

**Company contact:** wmhrsolution@gmail.com | +250796661213
**Languages supported:** English (en) + Chinese (zh) via `client/src/lib/i18n.ts`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript, Vite 7, Tailwind CSS 4, shadcn/ui (Radix), Framer Motion |
| Routing | Wouter |
| Data fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Backend | Express 5 + TypeScript, tsx (dev), esbuild (prod) |
| Auth | express-session + memorystore (cookie-based, no Passport) |
| ORM / DB | Drizzle ORM + drizzle-kit, PostgreSQL 16 |
| Storage (dev) | MemStorage (in-memory, no DB needed to run locally) |

---

## Project Layout

```
Talent-Acquisition-Suite/
├── client/src/
│   ├── pages/          # Home, About, Services, Jobs, Apply, Contact
│   │                   # AdminLogin, AdminDashboard, ChangePassword, not-found
│   ├── components/
│   │   ├── layout/     # MainLayout, Navbar, Footer
│   │   └── ui/         # shadcn/ui components
│   ├── lib/
│   │   ├── i18n.ts     # English + Chinese translations
│   │   └── queryClient.ts  # apiRequest() helper + React Query setup
│   └── assets/images/  # Logo, hero, testimonial images
├── server/
│   ├── index.ts        # Express app bootstrap + Vite middleware
│   ├── routes.ts       # All /api/* endpoints
│   ├── storage.ts      # IStorage interface + MemStorage implementation
│   └── static.ts       # Production static file serving
├── shared/
│   └── schema.ts       # Drizzle table definitions + Zod schemas
│                       # Tables: users, admins, jobs, applications, contacts
└── script/build.ts     # Vite + esbuild production build
```

---

## How to Run

### Development (no database needed)

```bash
cd Talent-Acquisition-Suite
npm install
npm run dev        # starts Express + Vite on http://localhost:5000
```

Everything runs on **port 5000**. The Express server hosts the API and proxies Vite for HMR.

### Production build

```bash
npm run build      # builds client → dist/public, server → dist/index.cjs
npm start          # NODE_ENV=production node dist/index.cjs
```

### With a real PostgreSQL database

```bash
DATABASE_URL="postgresql://user:pass@host:5432/dbname" npm run db:push
```

Set `DATABASE_URL` in a `.env` file (never commit this). Then swap `MemStorage` for a Drizzle-backed implementation in `server/storage.ts`.

---

## API Endpoints

All routes are prefixed `/api`.

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login with `{username, password}` |
| POST | `/api/auth/logout` | End session |
| GET  | `/api/auth/me` | Get current admin (401 if not logged in) |
| POST | `/api/auth/change-password` | Change password `{newPassword}` — requires auth |

### Admin management (super_admin only)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admins` | List all admins |
| POST | `/api/admins` | Create admin `{username, password, role}` |
| DELETE | `/api/admins/:id` | Delete admin by id |

### Jobs (public read, auth required for write)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/jobs` | List all jobs |
| POST | `/api/jobs` | Create job |
| PATCH | `/api/jobs/:id/status` | Update job status `{status}` |
| DELETE | `/api/jobs/:id` | Delete job |

### Applications
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/applications` | Submit application (public) |
| GET | `/api/applications` | List all applications (auth required) |

### Contact
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/contact` | Submit contact message (public) |

---

## Default Admin Credentials

On first run, MemStorage seeds one super_admin:

| Field | Value |
|-------|-------|
| Username | `MOU HAIYAN` |
| Password | `HAIYAN@123` |
| Role | `super_admin` |

The account has `mustChangePassword: true` — the user is redirected to `/admin/change-password` after first login.

Passwords are hashed with SHA-256 + a static salt (`server/storage.ts → hashPassword()`). For production, replace with bcrypt or argon2.

---

## Key Frontend Patterns

- **API calls** — always use `apiRequest(method, url, body?)` from `@/lib/queryClient`. It sends `credentials: "include"` for session cookies automatically.
- **Data fetching** — use `useQuery({ queryKey: ["/api/..."] })`. The default `queryFn` in `queryClient.ts` uses the query key as the URL.
- **Auth guard** — `AdminDashboard` calls `GET /api/auth/me` and redirects on 401. No localStorage used.
- **Translations** — `const { t } = useI18n()` then `t("key")`. Add new keys to both `en` and `zh` objects in `client/src/lib/i18n.ts`.

---

## What's Still Mock / Incomplete

- **File uploads** — CV filename is stored as text; actual file bytes are not saved. Add `multer` if real storage is needed.
- **Email sending** — contact form saves to DB but doesn't email anyone. Integrate nodemailer or a transactional email service.
- **Database** — MemStorage resets on every server restart. Set `DATABASE_URL` and implement `DrizzleStorage` in `server/storage.ts` to persist.
- **Tests** — none exist. Add Vitest for unit tests and Playwright for E2E.

---

## Common Tasks

### Add a new job via API
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"New Role","location":"Kigali","type":"Full-time","description":"...","deadline":"2026-06-30"}'
```
*(Requires being logged in as admin — session cookie needed.)*

### Add a translation key
Edit `client/src/lib/i18n.ts` and add the key under both `en` and `zh` objects, then use `t("your.key")` in the component.

### Add a new page
1. Create `client/src/pages/MyPage.tsx`
2. Add the route in `client/src/App.tsx`
3. Wrap with `<MainLayout>` if it needs the Navbar/Footer

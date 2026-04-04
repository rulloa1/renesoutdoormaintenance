# Rene's Outdoor Maintenance

A full-stack booking and admin portal for Rene's Outdoor Maintenance — a Houston-area outdoor services business.

Built with **React + TypeScript** on the frontend, **tRPC** for type-safe API calls, **Drizzle ORM** with **Cloudflare D1** (SQLite) for the database, and deployed to **Cloudflare Pages**.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| API | tRPC (type-safe RPC over HTTP) |
| Auth | HMAC-SHA256 JWT via Web Crypto API |
| Database | Cloudflare D1 (SQLite) via Drizzle ORM |
| Hosting | Cloudflare Pages + Pages Functions |

## Project Structure

```
├── src/
│   ├── pages/           # Route-level React components
│   │   ├── Home.tsx
│   │   ├── Services.tsx
│   │   ├── Booking.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── OwnerLogin.tsx
│   │   └── OwnerDashboard.tsx
│   ├── components/      # Reusable UI components
│   ├── server/          # Backend logic (runs in Cloudflare Pages Functions)
│   │   ├── schema.ts    # Drizzle ORM schema
│   │   ├── db.ts        # DB helpers, password hashing, JWT
│   │   ├── router.ts    # tRPC router (API endpoints)
│   │   ├── trpc.ts      # tRPC setup
│   │   └── context.ts   # Request context type
│   └── App.tsx          # Client-side router
├── functions/
│   └── trpc/[trpc].ts   # Cloudflare Pages Function entry point
└── wrangler.toml        # Cloudflare configuration
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home page |
| `/services` | Services listing |
| `/booking` | Customer booking form |
| `/admin` | Admin login |
| `/admin/*` | Admin dashboard (protected) |
| `/owner` | Owner login |
| `/owner/*` | Owner dashboard (protected) |

## API Endpoints (tRPC)

| Procedure | Type | Auth | Description |
|-----------|------|------|-------------|
| `admin.login` | mutation | public | Login as admin or owner |
| `admin.me` | query | public | Get current session |
| `admin.logout` | mutation | public | Clear session cookie |
| `appointments.create` | mutation | public | Submit a booking |
| `appointments.list` | query | protected | List appointments (supports `status` filter) |
| `appointments.updateStatus` | mutation | protected | Update appointment status |

## Environment Variables

Set these in Cloudflare Pages → Settings → Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | ✅ Yes | Secret key for signing session tokens. Use a random 32+ character string. |

## Local Development

```bash
npm install
npm run dev
```

Requires a `.dev.vars` file with:
```
JWT_SECRET=your-local-dev-secret
```

## Database Migrations

```bash
npx drizzle-kit generate
npx wrangler d1 migrations apply renes-outdoor-maintenance-db
```

## Deployment

Pushes to `main` automatically deploy via Cloudflare Pages CI/CD.

# GCL — Global Capital League

A pnpm monorepo containing the GCL marketing/member website and its Express API backend.

## Run & Operate (Replit)

- `pnpm --filter @workspace/api-server run dev` — run the API server (port from `$PORT`)
- `pnpm --filter @workspace/gcl-website run dev` — run the frontend dev server (port from `$PORT`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 20+, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS 4 + Wouter (routing) + Framer Motion
- API: Express 5 + Drizzle ORM + PostgreSQL
- Auth: Replit OIDC (openid-client) with database-backed sessions
- Validation: Zod, drizzle-zod
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/`)
- Build: esbuild (API server bundle)

## Where things live

| Path | Description |
|------|-------------|
| `artifacts/gcl-website/` | React/Vite SPA — all frontend pages and components |
| `artifacts/api-server/` | Express API server — routes, auth middleware, OIDC |
| `lib/db/` | Drizzle ORM schema + DB connection (`DATABASE_URL`) |
| `lib/api-zod/` | Zod schemas shared between frontend and API |
| `lib/api-client-react/` | Generated React Query hooks (run codegen to update) |
| `lib/api-spec/` | OpenAPI spec (source of truth for the API contract) |
| `api/index.ts` | Vercel serverless function — re-exports the Express app |
| `vercel.json` | Vercel deployment configuration |

## Architecture decisions

- The Express app (`artifacts/api-server/src/app.ts`) exports the app without calling `listen()`. On Replit the `src/index.ts` entry calls `listen`; on Vercel `api/index.ts` exports it directly for the serverless runtime.
- Sessions are stored in PostgreSQL (not in-memory), so they survive function cold-starts on Vercel.
- `BASE_PATH` env var controls the Vite base path. Replit sets it per-artifact; Vercel builds always use `/`.
- Auth uses Replit OIDC (`ISSUER_URL` + `REPL_ID` as `client_id`). On Vercel these must be set as environment variables.

## Deploying to Vercel

### One-time setup

1. Push this repository to GitHub.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects `pnpm-lock.yaml` and uses pnpm. No framework preset needed (`framework: null` in `vercel.json`).
4. Set the following **Environment Variables** in the Vercel project settings:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string. Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app) for a hosted Postgres. |
| `REPL_ID` | ✅ | Your Replit app ID — used as the OIDC `client_id` for Replit Auth. Find it in your Repl's settings. |
| `SESSION_SECRET` | ✅ | Any long random string (e.g. `openssl rand -hex 32`). Used to sign session cookies. |
| `ISSUER_URL` | ❌ | OIDC issuer URL. Defaults to `https://replit.com/oidc` — only set if you switch auth providers. |

5. Push a commit — Vercel automatically builds and deploys.

### How the deployment works

```
vercel.json
  buildCommand  →  vite build (artifacts/gcl-website → dist/public)
  outputDirectory → artifacts/gcl-website/dist/public   (served as static CDN)
  api/index.ts  →  Express app as a serverless function (Node.js runtime)

Routing:
  /api/*   →  serverless function (Express handles all /api/* routes)
  /*       →  index.html          (SPA — Wouter handles client-side routing)
```

### Database migration on Vercel

Run schema migrations from your local machine pointing at the production database:

```bash
DATABASE_URL="<prod-url>" pnpm --filter @workspace/db run push
```

## Required env (Replit dev)

- `DATABASE_URL` — Postgres connection string
- `PORT` — set automatically by Replit per-artifact
- `BASE_PATH` — set automatically by Replit per-artifact

## Gotchas

- `vite.config.ts`: `PORT` is not required during `vite build` (only dev/preview). `BASE_PATH` defaults to `/` when not set.
- The API server's `build.mjs` (esbuild bundle) is used on Replit only. Vercel uses its own bundler for `api/index.ts`.
- `pnpm-workspace.yaml` excludes non-linux-x64 native binaries to reduce install size. Vercel builds run on Linux x64 — compatible.
- Vercel serverless functions are stateless; the OIDC discovery config (`oidcConfig` in `auth.ts`) is cached per cold-start, not across invocations.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

# GCL — Global Capital League

A static, no-login marketing site for Global Capital League, built as a pnpm monorepo package.
See `README.md` for the full guide (design system, content, deployment).

## Run & Operate

- `pnpm dev` — start the site (Vite, port from `$PORT`, defaults to 5173)
- `pnpm run typecheck` — typecheck
- `pnpm run build` — typecheck + production build (`artifacts/gcl-website/dist`)

## Stack

React 19 · Vite 7 · Tailwind CSS 4 · Framer Motion · Lenis · Wouter · cobe (globe). No backend, no database, no auth.

## Where things live

| Path | What |
|------|------|
| `artifacts/gcl-website/src/config/site.ts` | Org facts, emails, donate/apply links, headline stats |
| `artifacts/gcl-website/src/data/` | Chapters, team, events, courses, programs, stories |
| `artifacts/gcl-website/src/pages/` | Routes |
| `artifacts/gcl-website/src/components/` | Design-system and showcase components |
| `vercel.json` | Vercel build + security headers |

## User preferences

- No sign-in, accounts or admin features — the site is fully static.

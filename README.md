# Global Capital League — website

The public website of **Global Capital League (GCL)**, Asia's largest youth-led financial literacy non-profit (formerly Vanguard Capital League).

It is a fully static single-page site: no sign-in, no accounts, no database, no server code. Donations, applications and registrations open the visitor's email app (or an external form you configure), so there is nothing to host but files.

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm run build    # typecheck + production build → artifacts/gcl-website/dist
pnpm preview      # serve the production build locally
```

Requires Node 20+ and pnpm 10.

## Deploy to Vercel

1. Import this repository at [vercel.com/new](https://vercel.com/new).
2. Leave **Root Directory** as the repository root and **Framework Preset** as "Other". `vercel.json` supplies the install command, build command, output directory, SPA routing and security headers.
3. Deploy. No environment variables are needed.

If you prefer to set the Root Directory to `artifacts/gcl-website`, that works too — it has its own `vercel.json` with the same settings.

### What `vercel.json` does

- Installs with a pinned pnpm (`10.26.1`) and a frozen lockfile.
- Builds only the website package.
- Rewrites every non-file route to `index.html` so deep links like `/chapters` work.
- Sends strict security headers on every response: a Content-Security-Policy that allows only same-origin scripts, fonts and media (the site makes **no** third-party requests), HSTS, `X-Frame-Options: DENY`, `nosniff`, a tight `Permissions-Policy`, and COOP/CORP.
- Caches fingerprinted `/assets/*` for a year.

## Edit content

Almost everything lives in two places:

| File | What it controls |
|------|------------------|
| `artifacts/gcl-website/src/config/site.ts` | Organisation name, HQ, contact emails, **donation link**, **application form link**, social links, headline stats, summer program dates |
| `artifacts/gcl-website/src/data/*.ts` | Chapters, team, events, courses, programs, testimonials |

- **Donations:** set `donateUrl` to a hosted page (Stripe Payment Link, Givebutter, Donorbox…). Until then every Donate button emails `give@…`.
- **Applications:** set `applyUrl` to a Google Form / Tally link, or leave it empty to use email.
- **Socials:** fill in any of `social.instagram`, `linkedin`, `telegram`, `youtube`, `tiktok`; empty ones are hidden.
- **Domain:** the canonical URL is `https://globalcapitalleague.org`. If yours differs, update `site.url` and the absolute URLs in `index.html`, `public/robots.txt` and `public/sitemap.xml`.
- **Events** move from "Upcoming" to "Archive" automatically after their date. The summer program copy switches to "register interest" after it ends.

Photos and videos are in `src/assets/media/` (already compressed to WebP / H.264). To add one, export it at ~1600px on the long edge and import it where needed.

## Design system

- **Palette:** taken from the GCL logo — night navy `#0A1633`, glowing sky blue `#3AA9FF` / `#8AD3FF`, soft white `#F6F9FF`.
- **Type:** Archivo variable for big friendly headlines (animated along its width axis), Instrument Serif italic for accents, JetBrains Mono for small labels. All fonts are self-hosted.
- **Logo:** the original glowing GLOBAL / CAPITAL LEAGUE wordmark (`src/assets/media/gcl-logo.webp`) in the nav, footer, intro and share image. Favicons use a small ring-and-arrow mark in the same blue (`public/favicon.svg`).
- **Signature pieces:** kinetic hero type that reacts to the cursor, a scroll-drawn growth chart of the chapter network, a pinned horizontal program reel, a three-question "bias lab", a split-flap departure board of chapters, a WebGL globe with arcs to every chapter, and a full-bleed wordmark footer.
- Every animation respects `prefers-reduced-motion`.

## Project layout

```
artifacts/gcl-website/     the site (React 19 + Vite 7 + Tailwind 4)
  src/config/site.ts       organisation facts and links
  src/data/                content
  src/components/          design system + showcase components
  src/pages/               routes: /, /about, /programs, /chapters, /events, /team, /get-involved, /privacy, /terms
  public/                  favicons, manifest, robots, sitemap, og image
vercel.json                deployment + security headers
```

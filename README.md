# Global Capital League — website

The public website of **Global Capital League (GCL)**, Asia's largest youth-led financial literacy non-profit (formerly Vanguard Capital League).

It is a static site built with React, Vite and Tailwind CSS. There is no sign-in, no database and no server code: Donate, Apply and Register buttons open the visitor's email app, or a hosted form you configure. Deploying it only means hosting files.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and choose **Import Git Repository**.
2. If this repository is not listed, click **Adjust GitHub App Permissions** and give Vercel access to it.
3. Pick the repository and leave every setting at its default. Vercel reads `vercel.json`: framework Vite, `npm ci`, `npm run build`, output `dist`.
4. Click **Deploy**. No environment variables are needed.

Every push to `main` redeploys the live site; other branches get preview links.

`vercel.json` also:
- sends every page URL (like `/chapters`) to the app, so deep links work;
- adds strict security headers: a Content-Security-Policy that only allows the site's own files (it makes no third-party requests), HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` and `Permissions-Policy`;
- caches the fingerprinted files in `/assets/` for a year.

## Edit content

| File | What it controls |
|------|------------------|
| `src/config/site.ts` | Name, HQ, contact emails, **donation link**, **application form link**, social links, headline numbers, summer program dates |
| `src/data/*.ts` | Chapters, team, events, courses, programs, testimonials |
| `src/assets/media/` | Photos, videos and the GCL logo |

- **Donations:** set `donateUrl` to a hosted donation page (Stripe Payment Link, Givebutter, Donorbox…). Until then, Donate buttons email `give@globalcapitalleague.org`.
- **Applications:** set `applyUrl` to a Google Form or Tally link, or leave it empty to use email.
- **Social links:** fill in any of `social.instagram`, `linkedin`, `telegram`, `youtube`, `tiktok`. Empty ones are hidden.
- **Domain:** the site assumes `https://globalcapitalleague.org`. If yours differs, change `site.url` and the URLs in `index.html`, `public/robots.txt` and `public/sitemap.xml`.
- **Events** move to the archive automatically after their date.
- **New photos:** export at about 1600px on the long side as WebP, put them in `src/assets/media/` and import them where needed.

## Design

- **Colors:** from the GCL logo: night navy `#0A1633`, glowing sky blue `#3AA9FF` / `#8AD3FF`, soft white `#F6F9FF`.
- **Type:** Archivo (big headlines that stretch toward the cursor), Instrument Serif italic for accents, JetBrains Mono for small labels. All fonts are self-hosted.
- **Logo:** the original glowing GLOBAL / CAPITAL LEAGUE wordmark (`src/assets/media/gcl-logo.webp`). Favicons are in `public/`.
- **Highlights:** a scroll-drawn growth chart, a sideways-scrolling programs reel, a three-question bias quiz, a flip-board of chapters, a globe linking every chapter to Tashkent, and a photo strip of real sessions.
- All motion is turned off for visitors whose device asks for reduced motion.

## Project layout

```
index.html            page shell, SEO and social-share tags
src/
  config/site.ts      organisation facts and links
  data/               content
  components/         shared UI and showcase components
  pages/              /, /about, /programs, /chapters, /events, /team, /get-involved, /privacy, /terms
  assets/media/       logo, photos, videos
public/               favicons, manifest, robots.txt, sitemap.xml, og.jpg
vercel.json           deployment settings and security headers
```

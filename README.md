# GTA 6 World Countdown 🌴

Fan-made **GTA 6 (Grand Theft Auto VI)** world launch countdown site.
Default country: **Pakistan 🇵🇰** — first-launch reference: **New Zealand 🇳🇿** (GTA VI unlocks at midnight **local time** on **19 November 2026**).

Live: https://gta-vi-countdown.supersoftware.agency
GitHub: https://github.com/AbdulRehmanAzizSheikh/gta-6-world-countdoun

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 (liquid-glass theme)
- MongoDB (`mongodb` driver) — database name: **`gta`** (visitor stats, likes/dislikes, subscribers, feedback)
- Admin panel at **`/admin`** (password via `ADMIN_PASSWORD`, default `00112233`)

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev                  # http://localhost:3000
```

### Environment variables (`.env.local` — never commit this file)

```bash
MONGODB_URI=mongodb+srv://<user>:<pass>@<host>/gta   # database: gta
ADMIN_PASSWORD=00112233                              # /admin login
```

> On Vercel, add the same two variables under **Settings → Environment Variables**, then redeploy.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm start` — production server

## What the site does

- Live GTA 6 countdown **per selected country** (local midnight, 19 Nov 2026)
- **New Zealand first-launch** countdown + NZ launch shown in your local time
- Country comparison tool (default Pakistan vs India, any two countries)
- **Like / Dislike** counters (top bar)
- **Subscribe** with email (stored in MongoDB)
- **Feedback** form (stored in MongoDB, shown in `/admin`)
- **`/admin` panel** — stats: visits, likes, dislikes, subscribers & all feedback
- Background music player (presets: Kevin MacLeod, CC BY 4.0) + **upload your own MP3 — stays on your device, never uploaded to the server**
- Official Rockstar GTA VI artwork background slideshow (desktop & mobile)

---

## 🔍 SEO — what YOU need to do (owner tasks)

These are the off-code SEO steps. The code-side SEO (metadata, sitemap, robots.txt, JSON-LD, Open Graph image, canonical URL, fast loading) is already done.

### 1. Deploy & domain
- [ ] Vercel → import this repo → deploy
- [ ] Vercel → **Settings → Domains** → add `gta-vi-countdown.supersoftware.agency`
- [ ] Point DNS for `gta-vi-countdown.supersoftware.agency` to Vercel (usually a `CNAME` to `cname.vercel-dns.com`, or `A` record to `76.76.21.21` for apex)
- [ ] Ensure **HTTPS** is on and choose one canonical version (e.g. non-www) — redirect the other
- [ ] Set `MONGODB_URI` and `ADMIN_PASSWORD` in Vercel env vars → redeploy

### 2. Google Search Console (most important)
- [ ] Go to https://search.google.com/search-console
- [ ] **Add property** → choose "Domain" → enter `supersoftware.agency` (or "URL prefix" with the exact countdown URL)
- [ ] Verify ownership (DNS TXT record at your domain provider, or HTML file upload)
- [ ] **Sitemaps** → submit: `https://gta-vi-countdown.supersoftware.agency/sitemap.xml`
- [ ] **URL Inspection** → paste the homepage URL → **Request indexing**
- [ ] Check **Pages** report after a few days — confirm it gets indexed

### 3. Bing Webmaster Tools
- [ ] https://www.bing.com/webmasters → add the site → verify (import from Google Search Console is easiest)
- [ ] Submit the same sitemap

### 4. Analytics
- [ ] Enable **Vercel Analytics** (Project → Analytics → Enable) — zero code needed, shows visitors
- [ ] Or add **Google Analytics 4**: create property → get `G-XXXXXXX` ID → add `<Script>` with gtag in `src/app/layout.tsx` (ask me and I'll wire it up)

### 5. Social & sharing
- [ ] Share the link on X/Twitter, Reddit (r/GTA, r/GTA6), Discord servers, YouTube comments, Facebook — with a short text like "GTA 6 countdown for Pakistan"
- [ ] Add the countdown link on **supersoftware.agency** (portfolio/projects page) — an internal backlink helps ranking
- [ ] Add link in GitHub repo **About** section (done) and in your social bios

### 6. Keep it fresh (helps rankings)
- [ ] Keep the site updated — the countdown updates itself, but occasionally update the footer/hero copy
- [ ] On launch day (19 Nov 2026), update the title/description to "GTA 6 is OUT — watch the world launch" — traffic will spike
- [ ] Respond to feedback from the `/admin` panel — engagement signals help

### 7. Monitor
- [ ] Weekly: check Search Console "Performance" — impressions/clicks for queries like "GTA 6 Pakistan time", "GTA 6 India launch time"
- [ ] Run Lighthouse in Chrome DevTools → keep Performance/SEO/Best Practices 90+

---

## Already done (code-side SEO)

✅ Full metadata: title template, description, keywords, authors, canonical, robots, OG, Twitter cards
✅ `sitemap.xml` (`src/app/sitemap.ts`) ✅ `robots.txt` (`src/app/robots.ts`) — `/admin` & `/api` disallowed
✅ JSON-LD structured data (WebSite + Organization + WebApplication)
✅ Open Graph image — auto-generated at `/opengraph-image` via `src/app/opengraph-image.tsx` (uses official Rockstar cover art)
✅ Theme color, mobile viewport, `lang="en"`, favicon (`src/app/icon.png`)
✅ `noindex` on `/admin`
✅ Semantic headings, `alt` text on images, lazy-loaded images
✅ Statically prerendered homepage (fast on Vercel edge)

> Fan site — not affiliated with Rockstar Games. Uses official GTA VI artwork from Rockstar's media page for non-commercial fan purposes.

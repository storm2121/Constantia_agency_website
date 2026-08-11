# Constantia — Agency Website

Marketing and portfolio site for [Constantia](https://constantia.ma), a creative
agency working across photography, videography, motion, design, web and
strategy.

Built with Next.js 16 (App Router, static export), React 19, Tailwind 4, GSAP
and Lenis. Content is served from Firestore at build time, with a complete
local fallback so the site builds without any credentials.

> **Heads up:** `public/` is excluded from this repository. The site will run
> and behave correctly on a fresh clone, but images, video and the custom
> typeface will be missing. See [`public/README.md`](public/README.md).

---

## Quick start

Requires **Node 20.9+** (Node 22 recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

No environment variables are needed. Without Firebase credentials the app falls
back to the seed content in `src/lib/data/`, which is a full working dataset.
See [`.env.example`](.env.example) if you need live Firestore content or want to
run the import scripts.

---

## Architecture

### Desktop and mobile are separate component trees

This is the single most important thing to understand before changing anything.

The desktop site is built around scroll-driven storytelling — a GSAP
video-scrub hero, a pinned wipe layer, a 500vh hover slider, Lenis smooth
scroll. None of that survives a 390px phone screen, so **mobile gets a
completely different tree of components**, chosen server-side from the
user-agent so the first HTML painted on a phone is already the mobile version.

- `src/lib/device.ts` — `isMobileUA()`, the server-side decision
- `src/components/mobile/` — the entire mobile tree
- Breakpoint: **< 1024px is mobile**

Read [`docs/MOBILE.md`](docs/MOBILE.md) before touching either tree. It explains
the detection strategy, the edge cases, and why the split exists.

### Content pipeline

```
Firestore ──(build time, firebase-admin)──> content-repository.ts ──> pages
                                                    │
                    src/lib/data/*.ts ──(fallback)──┘
```

`src/lib/content-repository.ts` tries Firestore first and silently falls back to
the committed seed data if no credential is configured. Collections used:
`talents`, `portfolioSummaries`, `portfolioDetails`.

Media is **not** proxied — object paths in the content data are turned into
public Firebase Storage URLs by `getFirebaseStoragePublicUrl()` and fetched
directly by the browser. Public read is granted by `storage.rules` for
`portfolios/**` and `talents/**`; everything else is denied.

Writes are denied to everyone in both `firestore.rules` and `storage.rules`.
Content only enters the database through the admin scripts below.

### Layout

```
src/
├── app/              routes (App Router) + globals.css
├── components/       desktop components
│   └── mobile/       mobile components (separate tree)
├── lib/
│   ├── data/         seed content — the no-credential fallback
│   ├── content-repository.ts
│   ├── firebase-admin.ts
│   └── device.ts
├── hooks/
docs/MOBILE.md        mobile architecture (read this)
storageguide.md       Firebase Storage conventions
ops/budget-kill-switch/  Cloud Function that kills billing at 90% of budget
scripts/              content seed + import scripts (need a credential)
```

---

## Scripts

```bash
npm run dev                    # dev server
npm run build                  # static export to out/
npm run lint                   # eslint

npm run deploy:firebase        # build + deploy hosting
npm run deploy:firebase:preview # deploy to a preview channel
```

Content scripts — these **write** to Firestore/Storage and need admin
credentials (see `.env.example`):

```bash
npm run seed:firebase-content
npm run import:photo:firebase
npm run import:video:firebase
npm run import:motion:firebase
npm run import:design:firebase
```

---

## Known issues

Worth knowing before you start, so you don't lose a day to any of them:

1. **Desktop pages other than `/` cannot be scrolled when opened directly.**
   `scroll-locked` is set on `<html>` in the root layout and only removed by
   `LoadingScreen`, which is mounted on the homepage tree. Land on
   `/portfolio` from a shared link on desktop and the page is frozen. Same if
   JS fails — there is no `<noscript>` fallback.

2. **`/contact` returns an error page.** `src/app/contact/page.tsx` uses a
   runtime `redirect()`, which cannot be statically exported. It should be a
   `redirects` entry in `firebase.json` instead.

3. **The contact form and chatbot do not work in production.** With
   `output: 'export'` there are no API routes in the build, but `ChatBot.tsx`,
   `CTASection.tsx` and `MobileCTA.tsx` all POST to `/api/*`. Submissions fail
   silently. The contact handler also only `console.log`s — nothing is stored
   or emailed.

4. **`npm run lint` fails out of the box** — 11 errors. Most are `require()`
   style imports in `scripts/` and `ops/` that should be excluded from the
   lint config. One is real: `StatsSection.tsx` uses `updatePhysics` before it
   is declared, so the rAF loop captures a stale closure.

5. **`npm audit` reports vulnerabilities** in `firebase-admin`'s transitive
   dependencies. Build-time only — firebase-admin never runs in production
   because the export is static.

---

## Deployment

Firebase Hosting, static export:

```bash
npm run deploy:firebase
```

`firebase.json` runs `npm run build` as a predeploy step and serves `out/`.

Note there are currently **no security headers** configured (no CSP,
`X-Frame-Options`, `Referrer-Policy` or HSTS), and `next.config.ts` sets
`dangerouslyAllowSVG: true`. Worth addressing in the hosting `headers` block.

---

## License

Proprietary — all rights reserved. See [LICENSE](LICENSE). This code is
published for reference; it is not open source, and the media it references is
not licensed for redistribution.

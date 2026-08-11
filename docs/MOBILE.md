# Mobile Version — Architecture & Conventions

This document describes the separate mobile experience shipped for phones and tablets. It is intentionally decoupled from the desktop site so that the GSAP / Lenis / scroll-scrubbed desktop tree is never modified or loaded on small screens.

---

## Why a separate tree

The desktop site is built around heavy scroll-driven storytelling:
- A GSAP video-scrub hero and a pinned `VideoWipe` layer.
- A scattered floating `TeamSection` that requires pointer precision.
- Lenis smooth-scroll on every page.
- `ServicesHoverSlider` that takes up `500vh` of scroll to pan through 5 services.

None of these translate well to a 390 × 844 phone screen, and making them responsive would either water them down for desktop users or be unusable on phones. Option 2 — serve a completely different tree of components to mobile users — keeps both experiences at their best and guarantees no desktop regression.

---

## Detection strategy

**Server-side, user-agent first.** We read the `user-agent` header in Server Components with `next/headers` and pass the verdict down. This means the first HTML painted on a phone is already the mobile tree — no flash of desktop, no hydration mismatch.

- `src/lib/device.ts` — `isMobileUA(ua: string): boolean`. Matches iPhone / iPod / iPad / Android / Windows Phone / BlackBerry and similar tokens.
- `src/hooks/useIsMobile.ts` — optional client-side hook tied to the `(max-width: 1023.98px)` media query. Useful *inside* mobile components that want to react to orientation or window resize (e.g. a carousel recalculating slide width). It is **not** used to flip between mobile/desktop trees at runtime, because that would require shipping both bundles and defeats the whole point.

Breakpoint: **< 1024px** counts as mobile (phones + tablets in portrait). Desktop starts at `1024px`, matching the existing `lg:` Tailwind breakpoint the site already uses.

### Edge cases

- **Desktop browser resized below 1024px.** User sees the desktop tree but in a narrow window. Hard refresh is required for the mobile tree to render. This is intentional — it keeps code-splitting honest and matches how real users arrive (phones send mobile UA, computers send desktop UA).
- **iPad Pro in landscape (1024px+).** Reports iPad in its UA, so `isMobileUA` returns `true` and the mobile tree renders. This is deliberate — the mobile tree is more touch-friendly even when the screen is wide enough for desktop layouts.

---

## Routing pattern

Every public page follows the same three-part shape:

```
src/app/<route>/page.tsx            ← server component, gate. Reads UA, fetches data,
                                      renders MobileX or DesktopX.
src/components/<route>/DesktopX.tsx ← the original page body, moved verbatim.
src/components/<route>/MobileX.tsx  ← the new mobile tree (composes mobile/* sections).
```

Example — home:

```tsx
// src/app/page.tsx
import { headers } from 'next/headers';
import { isMobileUA } from '@/lib/device';
import DesktopHome from '@/components/home/DesktopHome';
import MobileHome from '@/components/home/MobileHome';

export default async function Home() {
  const ua = (await headers()).get('user-agent') || '';
  const mobile = isMobileUA(ua);
  const [talents, projectsByTalent] = await Promise.all([ /* ... */ ]);
  return mobile
    ? <MobileHome talents={talents} />
    : <DesktopHome talents={talents} projectsByTalent={projectsByTalent} />;
}
```

Because the gate is a Server Component, whichever tree is chosen is the only one that gets rendered into HTML, and only that tree's client components get their JS shipped to the browser. The unchosen tree never appears in the response.

---

## Lenis smooth-scroll on mobile

Lenis is disabled for mobile visitors. The root `src/components/SmoothScroll.tsx` accepts an `enabled` prop (defaults to `true`). When `false`, it renders children with native scroll — fast, battery-friendly, and matches iOS/Android expectations. `src/app/layout.tsx` reads the UA and passes `enabled={!isMobile}`.

---

## Mobile component library

Location: `src/components/mobile/`. All components are new — none overlap with or import from the desktop tree. They share the site's existing design tokens:

| Token | Value | Source |
|---|---|---|
| Primary accent | `#61cbf8` | `--c-cyan` in `globals.css` |
| Gray bg | `#cdcdcd` | `--c-gray` |
| Dark bg | `#0a0a0a` | hardcoded, matches portfolio/talent pages |
| Body text | `#1a1a1a` (light) / `rgba(255,255,255,.85)` (dark) | per section |
| Display font | `Labil Grotesk` | `--font-display` |
| Body font | `Inter` | `--font-inter` |
| Serif | `Playfair Display` | `--font-playfair` |
| Motion library | Framer Motion | already in deps |

**Components:**

| Component | Role |
|---|---|
| `MobileNavbar` | Sticky slim top bar + slide-over menu |
| `MobileHero` | Full-viewport brand hero with tagline |
| `MobileServices` | Vertical stack of tappable service cards |
| `MobileVision` | Full-bleed image + pull-quote |
| `MobileTeam` | Horizontal scroll-snap carousel of talent cards |
| `MobileStats` | 2×2 counter grid (IntersectionObserver-triggered) |
| `MobileCTA` | Contact form, posts to the existing `/api/contact` |
| `MobileFooter` | Accordion sections + socials |
| `MobilePortfolioGrid` | 1-col grid + pill filter sheet |
| `MobileProjectDetail` | Stacked hero + metadata + related work |
| `MobileTalentsGrid` / `MobileTalentDetail` | Talent list + profile |
| `MobileServicePortfolio` / `MobileServiceProjectDetail` | Per-service portfolio |

---

## Adding a mobile version of a new page

1. In `src/app/<route>/page.tsx`, read headers and branch:
   ```tsx
   const ua = (await headers()).get('user-agent') || '';
   if (isMobileUA(ua)) return <MobileX {...props} />;
   return <DesktopX {...props} />;
   ```
2. Create `src/components/<route>/MobileX.tsx` — compose sections from `src/components/mobile/*` where possible; build new atomic pieces only when no existing section fits.
3. Use the design tokens listed above — do **not** introduce new colors or fonts.
4. Prefer Framer Motion `motion.*` components and `viewport={{ once: true, margin: '-10% 0px' }}` for scroll reveals. Do not import from `@/lib/gsap` in mobile trees.
5. Keep touch targets ≥ 44 × 44 px. Test with real thumbs, not just a trackpad.

---

## Testing matrix

| Platform | Viewport | What to verify |
|---|---|---|
| iPhone 14 (real or DevTools) | 390 × 844 | Mobile tree renders, no horizontal scroll, tap targets reachable |
| Pixel 7 | 412 × 915 | Same |
| iPad | 820 × 1180 | Mobile tree still renders (UA-based); layout uses tablet-friendly widths |
| Desktop ≥ 1024px | any | Desktop tree renders **unchanged** — GSAP hero scrub, video wipe, Lenis smooth scroll all behave exactly as before |

### Bundle check

Run `next build` and look at the route-level JS size for `/`:
- Mobile UA request → chunk should not include `Hero.tsx`, `VideoWipe.tsx`, `TeamSection.tsx`, `ServicesHoverSlider.tsx`, `gsap`, `lenis`.
- Desktop UA request → chunk matches the current baseline.

### Force a device during development

```bash
curl -H "User-Agent: iPhone" http://localhost:3000/ | grep -i "mobile"
```

Or run Chrome DevTools → Device Toolbar → pick a phone → hard reload (the UA changes, server re-renders).

---

## Files modified vs created

**Modified (additive — defaults preserve desktop behavior):**
- `src/app/layout.tsx` — reads UA, passes `enabled={!isMobile}` to SmoothScroll.
- `src/components/SmoothScroll.tsx` — added optional `enabled` prop.
- `src/app/**/page.tsx` — became gates. The desktop JSX that previously lived inline was moved verbatim into `src/components/<route>/DesktopX.tsx`.

**Created:**
- `docs/MOBILE.md` — this file.
- `src/lib/device.ts` — UA detection.
- `src/hooks/useIsMobile.ts` — client-side media query hook.
- `src/components/home/DesktopHome.tsx`, `src/components/home/MobileHome.tsx` (and equivalents for portfolio, talents, services).
- `src/components/mobile/*` — the mobile section library.

# `public/` — asset directory (contents not in version control)

The contents of this directory are **excluded from the repository**. It holds
client project media, licensed photography, team portraits and a commercially
licensed typeface — none of which we have the right to redistribute.

A fresh clone will therefore render the site with missing images, video and
fonts. The layout, animation and behaviour all work; only the media is absent.

## Expected layout

```
public/
├── fonts/
│   └── labil-grotesk/
│       ├── LabilGrotesk-Regular.woff2   ← required by globals.css
│       └── LabilGrotesk-Regular.ttf
├── images/
│   ├── hero/            hero poster stills
│   ├── portfolio/       project stills and placeholders
│   ├── services/        per-service cover images
│   └── vision/          editorial photography
├── members/             team portraits (referenced by src/lib/data/talents.ts)
└── videos/
    ├── hero/            hero reel + scroll-scrub variants
    └── services/        per-service background loops
```

## Getting the assets

Ask the maintainer for the current asset bundle and unzip it over this
directory. Do not commit it.

## Adding new assets

Before adding anything here, confirm we hold distribution rights for it. If in
doubt, keep it in Firebase Storage and reference it by URL instead — most
portfolio media already works that way via `getFirebaseStoragePublicUrl()`.

Optimise before adding: images should be resized to their display size, stripped
of EXIF metadata, and served as `.webp` or `.avif` where possible. `sharp` is
already available as a dev dependency.

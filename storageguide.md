# Constantia Portfolio Storage Guide

This document is the canonical guide for how Constantia portfolio content is staged locally, published to Firebase, linked to talents, and consumed by the website.

The active public portfolio model is:

- Five portfolio services only: `web`, `video`, `photo`, `motion`, `design`
- Seven talents total, linked by metadata, not by folder structure
- Firestore stores metadata
- Firebase Storage stores published derivatives
- Private source assets stay out of public metadata and out of public delivery paths
- Gallery pages load lightweight summary data only
- Heavy hero, gallery, and video media load only after the user opens a specific portfolio

## 1. Non-Negotiable Rules

- Do not use talent names as a canonical storage folder level under portfolio projects.
- The canonical storage unit is the **project**, not the talent.
- Every portfolio item must have one required `primaryTalentId`.
- Every portfolio item may have optional `collaboratorTalentIds`.
- Only published content may be returned by public site queries.
- Public frontend code must never list Firebase bucket contents.
- Public Firestore docs must never contain source-bucket paths.
- Service-account JSON files must never be committed to the repo.
- Client writes remain denied for both Firestore and Storage.

## 2. Public Portfolio Services

Only these service slugs are valid for public portfolio routes and public portfolio storage:

- `photo`
- `video`
- `motion`
- `design`
- `web`

These map to the site as:

- `photo` -> Photography
- `video` -> Videography
- `motion` -> Motion Graphics
- `design` -> Graphic Design
- `web` -> Web Development

`AI & Digital` is still part of the business, but it is not part of the public portfolio storage model or service portfolio routes.

## 3. Talent Linkage Model

Talents are stored once and referenced by ID.

### Firestore

- `talents/{talentId}`

### Required portfolio linkage fields

- `primaryTalentId`
- `collaboratorTalentIds`

### Rules

- `primaryTalentId` must point to an existing `talents/{talentId}` document.
- `collaboratorTalentIds` must contain only valid talent IDs.
- The right-side “person behind it” panel uses `primaryTalentId`.
- Collaborators are metadata only and do not change storage paths.

## 4. Firebase Structure

### Firestore collections

- `talents/{talentId}`
- `portfolioSummaries/{slug}`
- `portfolioDetails/{slug}`

### Private source bucket

Use a separate private bucket for originals and mezzanine files.

- `portfolio-source/{service}/{slug}/originals/...`
- `portfolio-source/{service}/{slug}/mezzanine/...`
- `talents-source/{talentId}/portrait-original/...`

These objects must never be referenced by public pages.

### Public delivery bucket

Use only published derivatives here.

- `talents/{talentId}/portrait/portrait.webp`
- `portfolios/{service}/{slug}/thumb/thumb.webp`
- `portfolios/{service}/{slug}/hero/hero.webp`
- `portfolios/{service}/{slug}/gallery/01.webp`
- `portfolios/{service}/{slug}/gallery/02.webp`
- `portfolios/{service}/{slug}/gallery/03.webp`
- `portfolios/{service}/{slug}/poster/poster.webp`
- `portfolios/{service}/{slug}/video/master.m3u8`
- `portfolios/{service}/{slug}/video/480p/...`
- `portfolios/{service}/{slug}/video/720p/...`
- `portfolios/{service}/{slug}/video/1080p/...`

### Path rules

- Use only lowercase kebab-case slugs.
- Do not put talent names under `portfolios/{service}/{slug}/...`.
- Do not overwrite published public keys in place if the browser should treat the asset as immutable.
- Prefer publishing a new versioned path when a public asset changes materially.

## 5. Firestore Document Shapes

## `talents/{talentId}`

Required fields:

- `id`
- `slug`
- `name`
- `role`
- `shortBio`
- `fullBio`
- `skills`
- `clients`
- `imagePath`
- `services`
- `order`
- `published`

Optional fields:

- `social`

Notes:

- `imagePath` points to the public delivery portrait path.
- `clients` is an array of `{ name, logo, url? }`.
- `published` must be `true` before the talent can appear publicly.

## `portfolioSummaries/{slug}`

Purpose: gallery cards, service portfolio grids, archive cards, talent preview work.

Required fields:

- `id`
- `slug`
- `service`
- `type`
- `category`
- `title`
- `shortDescription`
- `thumbnailPath`
- `primaryTalentId`
- `collaboratorTalentIds`
- `clientName`
- `date`
- `featured`
- `tags`
- `mediaKind`
- `published`
- `order`

Optional fields:

- `clientLogo`
- `posterPath`

Rules:

- Keep this document lightweight.
- Do not store full gallery arrays here.
- Do not store source file paths here.
- `mediaKind` must be one of:
  - `image-gallery`
  - `storage-video`
  - `youtube-embed`

## `portfolioDetails/{slug}`

Purpose: service detail page only.

Required fields:

- `slug`
- `service`
- `primaryTalentId`
- `fullDescription`
- `heroPath`
- `galleryPaths`
- `mediaKind`
- `published`

Optional fields:

- `posterPath`
- `hlsManifestPath`
- `youtubeVideoId`
- `youtubeStartSeconds`
- `caseStudyCredit`

Rules:

- `galleryPaths` must be ordered.
- `heroPath` should point to the main visual used at the top of the case study.
- `caseStudyCredit` overrides the generic talent role line in the sidebar.
- For `storage-video`, use `hlsManifestPath` and `posterPath`.
- For `youtube-embed`, use `youtubeVideoId` and optional `youtubeStartSeconds`.

## 6. Media Kinds

### `image-gallery`

Use when the portfolio is primarily still images.

Required:

- `thumbnailPath`
- `heroPath`
- `galleryPaths`

### `storage-video`

Use when Constantia hosts the public video delivery through Firebase Storage.

Required:

- `thumbnailPath`
- `posterPath`
- `hlsManifestPath`

Recommended:

- supporting stills in `galleryPaths`

Rules:

- Source upload stays private.
- Public delivery must use HLS, not the raw master MP4.
- Detail pages should not preload the full video; use poster-first and metadata-first behavior.

### `youtube-embed`

Use when the public video already lives on YouTube.

Required:

- `thumbnailPath`
- `posterPath`
- `youtubeVideoId`

Optional:

- `youtubeStartSeconds`

Rules:

- Store only the `youtubeVideoId` as the canonical field.
- Use the privacy-enhanced embed domain: `youtube-nocookie.com`.
- Lazy-load the iframe on interaction.

## 7. Local Submission Structure

This is the normalized local ingest tree that the team should work with before publishing to Firebase:

```text
submissions/
  video/
    ad-videos/
      manifest.json
      cover/
        cover.jpg
        hero.jpg
        poster.jpg
      gallery/
        01.jpg
        02.jpg
        03.jpg
      video/
        source.mp4
```

Equivalent structures apply to `web`, `photo`, `motion`, and `design`.

### Required local path rules

- The project folder name must equal the final portfolio slug.
- Each project must contain a `manifest.json`.
- The presence of `video/source.mp4` is for `storage-video` only.
- A YouTube-backed project may omit `video/source.mp4` and instead use `youtubeVideoId` in the manifest.

## 8. `manifest.json` Format

Every submission folder must have a `manifest.json`.

Required fields:

- `title`
- `slug`
- `service`
- `mediaKind`
- `primaryTalentId`
- `collaboratorTalentIds`
- `clientName`
- `date`
- `category`
- `type`
- `shortDescription`
- `fullDescription`
- `thumbnailFile`
- `heroFile`
- `galleryFiles`
- `published`
- `featured`
- `order`
- `tags`

Optional fields:

- `caseStudyCredit`
- `sourceVideoFile`
- `posterFile`
- `clientLogo`
- `youtubeVideoId`
- `youtubeStartSeconds`

Reference example:

- [submissions/video/ad-videos/manifest.json](submissions/video/ad-videos/manifest.json)

## 9. Worked Example: Current Folder to Canonical Structure

Current human-organized folder:

```text
Videography/
  Youssef_Azzouggarh/
    Ad videos/
      videos.mp4
```

Canonical local staging structure:

```text
submissions/
  video/
    ad-videos/
      manifest.json
      cover/
        cover.jpg
        hero.jpg
        poster.jpg
      gallery/
        01.jpg
        02.jpg
      video/
        source.mp4
```

The key transformation is:

- talent name leaves the folder path
- project slug becomes the canonical folder
- talent linkage moves into `manifest.json`

Example Firestore linkage after publish:

- `portfolioSummaries/ad-videos.primaryTalentId = "youssef-azzouggarh"`
- `portfolioDetails/ad-videos.primaryTalentId = "youssef-azzouggarh"`
- sidebar portrait/name/bio resolve from `talents/youssef-azzouggarh`

## 10. Publish Workflow

### Add a new image-only project

1. Create `submissions/{service}/{slug}/manifest.json`.
2. Place cover, hero, and gallery assets in the normalized local tree.
3. Validate `primaryTalentId` and any collaborators.
4. Upload originals to the private source bucket.
5. Generate public derivatives:
   - thumb
   - hero
   - gallery
6. Upload derivatives to the public delivery bucket.
7. Write `portfolioSummaries/{slug}`.
8. Write `portfolioDetails/{slug}`.
9. Set `published: true` only when assets and metadata are final.
10. Rebuild and redeploy the site.

### Add a Firebase-hosted video project

1. Prepare the local submission folder with `video/source.mp4`.
2. Upload the source video to the private source bucket.
3. Generate:
   - poster image
   - HLS manifest
   - HLS segments
4. Upload poster and HLS outputs to the public delivery bucket.
5. Write summary/detail docs with:
   - `mediaKind: "storage-video"`
   - `posterPath`
   - `hlsManifestPath`
6. Rebuild and redeploy.

### Add a YouTube-embedded project

1. Create the normalized submission folder and `manifest.json`.
2. Provide:
   - `mediaKind: "youtube-embed"`
   - `youtubeVideoId`
   - `posterFile`
3. Upload poster/thumbnail derivatives to the public bucket.
4. Write summary/detail docs with the YouTube fields.
5. Rebuild and redeploy.

## 11. Loading Strategy

To avoid loading heavy media for every visitor:

- gallery pages use only `portfolioSummaries`
- gallery cards use only thumbnails and lightweight metadata
- detail pages resolve `portfolioDetails` only for the requested slug
- image galleries load hero and supporting images only on the opened project page
- storage video loads only on the opened project page
- YouTube iframe loads only after user interaction

This is why the site stays lightweight even when there are many portfolio entries.

## 12. Caching and Versioning Rules

### Long immutable cache

Use this for:

- thumbnails
- hero images
- gallery images
- posters
- HLS segments

Recommended header:

- `Cache-Control: public, max-age=31536000, immutable`

### Short cache

Use this for:

- HLS manifests

Recommended header:

- `Cache-Control: public, max-age=60`

### Versioning rule

- Do not replace published public assets in place if the old path might still be cached.
- Prefer versioned paths or new object names when publishing updated media.

## 13. Security Rules and Safety Notes

- Firestore public reads are allowed only for `published == true`.
- Storage public reads should be limited to public delivery prefixes only.
- Client writes are denied.
- Private source bucket objects must never be public.
- Do not store draft/private object paths in public summary/detail docs.
- Do not commit service-account JSON into the repo.
- Admin scripts bypass rules, so credential access must be tightly controlled.

## 14. Environment and Credentials

Build-time/admin Firebase access can come from:

- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `FIREBASE_SERVICE_ACCOUNT_BASE64`
- `FIREBASE_SERVICE_ACCOUNT_PATH`
- `GOOGLE_APPLICATION_CREDENTIALS`

Companion values:

- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_PROJECT_ID` when not already in the credential source

Never hardcode credentials in application code.

## 15. Repository Responsibilities

- [src/lib/content-repository.ts](src/lib/content-repository.ts): build-time read layer for Firebase content
- [src/lib/firebase-admin.ts](src/lib/firebase-admin.ts): Firebase Admin initialization
- [scripts/seed-firebase-content.js](scripts/seed-firebase-content.js): seed script for the public Firebase content model
- [submissions/video/ad-videos/manifest.json](submissions/video/ad-videos/manifest.json): concrete example of the normalized local submission format
- [ops/budget-kill-switch/README.md](ops/budget-kill-switch/README.md): budget kill switch setup and billing re-enable steps

If the content model changes, update this guide in the same change set.

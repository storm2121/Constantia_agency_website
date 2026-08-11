/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const sharp = require('sharp')
const { getFirestoreDb, getStorageBucket } = require('./firebase-admin.cjs')

const db = getFirestoreDb()
const bucket = getStorageBucket()

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.m4v'])
const PUBLIC_CACHE_CONTROL = 'public, max-age=31536000, immutable'
const MANIFEST_CACHE_CONTROL = 'public, max-age=60'
const THUMB_WIDTH = 720
const HERO_WIDTH = 1700
const HERO_LIGHTBOX_WIDTH = 2400
const SECTION_PREVIEW_WIDTH = 1100
const SECTION_FULL_WIDTH = 2200
const VIDEO_POSTER_WIDTH = 1200
const VIDEO_POSTER_FULL_WIDTH = 2200

const AYOUB_ROOT = 'D:\\Constantia\\Content\\Graphic Design\\Ayoub Ahnay'
const YOUNES_ROOT = 'D:\\Constantia\\Content\\Graphic Design\\Younes Arbani'

const DESIGN_COLLECTIONS = [
  {
    id: 'themgoodolddays-playlist-cover-system',
    slug: 'themgoodolddays-playlist-cover-system',
    title: 'ThemGoodOldDays Playlist Cover System',
    root: AYOUB_ROOT,
    primaryTalentId: 'ayoub-ahnay',
    shortDescription:
      'A cover system built around nostalgic music artwork, mockups, and a disciplined retro palette.',
    fullDescription:
      'ThemGoodOldDays Playlist Cover System gathers a sequence of cover explorations and mockups shaped around nostalgia, tone, and repetition. The collection focuses on how a small image system can hold together across playlist environments while still letting each cover breathe as its own artifact.',
    category: 'music',
    featured: true,
    order: 0,
    date: '2024',
    clientName: '',
    clientLogo: undefined,
    caseStudyCredit: 'Cover Art / Graphic Design',
    tags: ['album cover', 'playlist artwork', 'music design', 'visual system'],
    sections: [
      {
        id: 'playlist-covers',
        title: 'Playlist Cover Sequence',
        kind: 'images',
        sources: ['Album Cover design\\ThemGoodOldDays - playlist'],
      },
    ],
  },
  {
    id: 'logo-marks-selection',
    slug: 'logo-marks-selection',
    title: 'Logo Marks Selection',
    root: AYOUB_ROOT,
    primaryTalentId: 'ayoub-ahnay',
    shortDescription:
      'A compact selection of logo explorations balancing mark clarity, geometry, and brand presence.',
    fullDescription:
      'Logo Marks Selection combines two logo development studies that each approach identity from a slightly different angle. One leans on structured reduction, the other on softer spatial balance, but both show a careful interest in how a mark has to survive across applications and scale.',
    category: 'brand',
    featured: false,
    order: 1,
    date: '2024',
    clientName: '',
    clientLogo: undefined,
    caseStudyCredit: 'Identity Design / Logo Development',
    tags: ['logo design', 'identity marks', 'brand system', 'symbol design'],
    sections: [
      {
        id: 'alburaq-hsr',
        title: 'Alburaq HSR',
        kind: 'images',
        sources: ['Logo Design\\Alburaq HSR'],
      },
      {
        id: 'gloryna-space',
        title: 'Gloryna Space',
        kind: 'images',
        sources: ['Logo Design\\Gloryna space'],
      },
    ],
  },
  {
    id: 'poster-studies',
    slug: 'poster-studies',
    title: 'Poster Studies',
    root: AYOUB_ROOT,
    primaryTalentId: 'ayoub-ahnay',
    shortDescription:
      'Poster experiments centered on layout tension, typography, and visual atmosphere.',
    fullDescription:
      'Poster Studies is a short but focused set of poster explorations where composition carries most of the weight. The work emphasizes hierarchy, typographic placement, and the relationship between a dominant visual and the negative space around it.',
    category: 'advertising',
    featured: false,
    order: 2,
    date: '2024',
    clientName: '',
    clientLogo: undefined,
    caseStudyCredit: 'Poster Design / Art Direction',
    tags: ['poster design', 'typography', 'layout', 'visual studies'],
    sections: [
      {
        id: 'poster-series',
        title: 'Poster Sequence',
        kind: 'images',
        sources: ['Poster Design'],
      },
    ],
  },
  {
    id: 'social-content-systems',
    slug: 'social-content-systems',
    title: 'Social Content Systems',
    root: AYOUB_ROOT,
    primaryTalentId: 'ayoub-ahnay',
    shortDescription:
      'A multi-client social design system spanning recommendation posts, cultural content, and niche brand visuals.',
    fullDescription:
      'Social Content Systems brings together multiple social-first visual systems built for different tones and audiences. The collection shows how layout, pacing, and recurring frame logic adapt across recommendation content, brand communication, and smaller editorial-style feeds without collapsing into the same template.',
    category: 'social',
    featured: true,
    order: 3,
    date: '2024',
    clientName: '',
    clientLogo: undefined,
    caseStudyCredit: 'Social Media Design / Visual Systems',
    tags: ['social design', 'content systems', 'campaign design', 'editorial posts'],
    sections: [
      {
        id: 'books',
        title: 'Books',
        kind: 'images',
        sources: ['Social Media Design\\L_blend - Creative Space\\Recommendation Posts2023\\books'],
      },
      {
        id: 'channels',
        title: 'Channels',
        kind: 'images',
        sources: ['Social Media Design\\L_blend - Creative Space\\Recommendation Posts2023\\channels'],
      },
      {
        id: 'documentaries',
        title: 'Documentaries',
        kind: 'images',
        sources: ['Social Media Design\\L_blend - Creative Space\\Recommendation Posts2023\\documm'],
      },
      {
        id: 'movies',
        title: 'Movies',
        kind: 'images',
        sources: ['Social Media Design\\L_blend - Creative Space\\Recommendation Posts2023\\movie'],
      },
      {
        id: 'podcasts',
        title: 'Podcasts',
        kind: 'images',
        sources: ['Social Media Design\\L_blend - Creative Space\\Recommendation Posts2023\\podcasts'],
      },
      {
        id: 'series',
        title: 'Series',
        kind: 'images',
        sources: ['Social Media Design\\L_blend - Creative Space\\Recommendation Posts2023\\series'],
      },
      {
        id: 'redone',
        title: 'Redone',
        kind: 'images',
        sources: ['Social Media Design\\Redone'],
      },
      {
        id: 'alassala-almaghribia',
        title: 'Alassala Almaghribia',
        kind: 'images',
        sources: ['Social Media Design\\Alassala Almaghribia'],
      },
      {
        id: 'the-chess-nerd',
        title: 'The Chess Nerd',
        kind: 'images',
        sources: ['Social Media Design\\TheChessNerd'],
      },
    ],
  },
  {
    id: 'web-landing-concept',
    slug: 'web-landing-concept',
    title: 'Web Landing Concept',
    root: AYOUB_ROOT,
    primaryTalentId: 'ayoub-ahnay',
    shortDescription:
      'A web landing concept presented as a single focused interface study rather than a full product system.',
    fullDescription:
      'Web Landing Concept is a concentrated interface study built around one landing view. The case study is intentionally narrow: instead of a complete product, it focuses on one strong surface and how brand, hierarchy, and image treatment can hold a page together with minimal supporting material.',
    category: 'digital',
    featured: false,
    order: 4,
    date: '2024',
    clientName: '',
    clientLogo: undefined,
    caseStudyCredit: 'UI Concept / Graphic Design',
    tags: ['web design', 'landing page', 'interface concept', 'visual layout'],
    sections: [
      {
        id: 'landing-page',
        title: 'Landing Page Study',
        kind: 'images',
        sources: ['Web Design\\Home@2x.jpg'],
      },
    ],
  },
  {
    id: 'regisol-educational-carousels',
    slug: 'regisol-educational-carousels',
    title: 'Regisol Educational Carousels',
    root: YOUNES_ROOT,
    primaryTalentId: 'younes-arbani',
    shortDescription:
      'A sectioned carousel system for Regisol that turns technical and brand information into readable social sequences.',
    fullDescription:
      'Regisol Educational Carousels collects a set of social carousels designed to make technical or institutional information feel easy to scan. The work is grounded in consistency and clarity, using repeated layout logic to turn separate educational topics into one coherent visual language.',
    category: 'digital',
    featured: true,
    order: 5,
    date: '2024',
    clientName: 'Regisol',
    clientLogo: '/images/clients/regisol.svg',
    caseStudyCredit: 'Carousel Design / Brand Communication',
    tags: ['carousel design', 'educational content', 'social graphics', 'energy sector'],
    sections: [
      {
        id: 'welcome-regisol',
        title: 'Bienvenue chez Regisol',
        kind: 'images',
        sources: ['Regisol\\Bienvenue chez REGISOL - Carrousel'],
      },
      {
        id: 'energy-morocco',
        title: 'Why Energy Matters in Morocco',
        kind: 'images',
        sources: ['Regisol\\Pourquoi l’énergie est-elle cruciale pour le Maroc aujourd’hui'],
      },
      {
        id: 'website-carousel',
        title: 'Regisol Website Carousel',
        kind: 'images',
        sources: ['Regisol\\Regisol - site web - Caroussel'],
      },
    ],
  },
  {
    id: 'regisol-campaign-assets',
    slug: 'regisol-campaign-assets',
    title: 'Regisol Campaign Assets',
    root: YOUNES_ROOT,
    primaryTalentId: 'younes-arbani',
    shortDescription:
      'Campaign-ready design assets for Regisol across banners, product visuals, profile imagery, and installation highlights.',
    fullDescription:
      'Regisol Campaign Assets gathers the brand-facing and promotional pieces built around Regisol’s public communication. It covers banner work, product visuals, profile assets, and location-based campaign posts, showing a more campaign-oriented side of the same visual system.',
    category: 'brand',
    featured: false,
    order: 6,
    date: '2024',
    clientName: 'Regisol',
    clientLogo: '/images/clients/regisol.svg',
    caseStudyCredit: 'Campaign Design / Visual Assets',
    tags: ['campaign assets', 'banner design', 'product visuals', 'brand communication'],
    sections: [
      {
        id: 'banners',
        title: 'Facebook & LinkedIn Banner',
        kind: 'images',
        sources: ['Regisol\\Facebook & Linkedin Banner'],
      },
      {
        id: 'product-series-1',
        title: 'Product Series I',
        kind: 'images',
        sources: ['Regisol\\Product 1 - Regisol'],
      },
      {
        id: 'product-series-2',
        title: 'Product Series II',
        kind: 'images',
        sources: ['Regisol\\Product 2 - Regisol'],
      },
      {
        id: 'product-series-3',
        title: 'Product Series III',
        kind: 'images',
        sources: ['Regisol\\Product 3 - Regisol'],
      },
      {
        id: 'rabat-installation',
        title: 'Rabat Installation Photovoltaïque',
        kind: 'images',
        sources: ['Regisol\\Rabat – Installation Photovoltaïque'],
      },
      {
        id: 'profile-picture',
        title: 'Profile Picture',
        kind: 'images',
        sources: ['Regisol\\Regisol - Profile Picture'],
      },
    ],
  },
  {
    id: 'regisol-social-reels',
    slug: 'regisol-social-reels',
    title: 'Regisol Social Reels',
    root: YOUNES_ROOT,
    primaryTalentId: 'younes-arbani',
    shortDescription:
      'Short-form Regisol reels paired with strong cover imagery so the design language remains clear before playback begins.',
    fullDescription:
      'Regisol Social Reels brings together motion-backed design outputs used in Regisol’s social communication. The collection stays image-first at the page level, but each reel remains fully playable on demand, preserving the balance between graphic composition and lightweight delivery.',
    category: 'social',
    featured: false,
    order: 7,
    date: '2024',
    clientName: 'Regisol',
    clientLogo: '/images/clients/regisol.svg',
    caseStudyCredit: 'Social Reels / Design Direction',
    tags: ['social reels', 'motion-supported design', 'campaign video', 'energy branding'],
    sections: [
      {
        id: 'global-wind-day',
        title: 'Global Wind Day',
        kind: 'mixed',
        sources: ['Regisol\\Global Wind Day - Post'],
        videoTitleOverrides: {
          'Global Wind Day - Regisol.mp4': 'Global Wind Day Reel',
        },
      },
      {
        id: 'photovoltaiques-reel',
        title: 'Photovoltaïques Reels',
        kind: 'mixed',
        sources: ['Regisol\\Reel 1 - Photovoltaïques'],
        videoTitleOverrides: {
          'Reel 1 - FB.mp4': 'Photovoltaïques Reel - Facebook',
          'Reel 1 - IN.mp4': 'Photovoltaïques Reel - Instagram',
        },
      },
    ],
  },
]

function normalizeBucketPath(filePath) {
  return filePath.replace(/\\/g, '/')
}

function getPublicStorageHttpUrl(objectPath) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    normalizeBucketPath(objectPath)
  )}?alt=media`
}

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: 'pipe',
  })

  if (result.status !== 0) {
    throw new Error(
      `${command} failed with exit code ${result.status}\n${result.stderr || result.stdout || ''}`.trim()
    )
  }

  return result.stdout.trim()
}

function assertPathExists(targetPath) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Required source path not found: ${targetPath}`)
  }
}

function compareNames(left, right) {
  return path.basename(left).localeCompare(path.basename(right), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

function isFirestoreDisabledError(error) {
  const message = String(error?.details || error?.message || '')
  return message.includes('firestore.googleapis.com') || message.includes('Cloud Firestore API')
}

async function assertFirestoreAvailable() {
  try {
    await db.collection('portfolioSummaries').limit(1).get()
  } catch (error) {
    if (isFirestoreDisabledError(error)) {
      throw new Error(
        'Cloud Firestore API is disabled for project constantia-agency. Enable firestore.googleapis.com in Google Cloud, wait a few minutes, then rerun this import.'
      )
    }

    throw error
  }
}

function isImagePath(filePath) {
  return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

function isVideoPath(filePath) {
  return VIDEO_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

function collectFiles(root, sources, predicate) {
  const collected = []

  for (const relativeSource of sources) {
    const absoluteSource = path.join(root, relativeSource)
    assertPathExists(absoluteSource)
    const stats = fs.statSync(absoluteSource)

    if (stats.isFile()) {
      if (predicate(absoluteSource)) {
        collected.push(absoluteSource)
      }
      continue
    }

    const entries = fs
      .readdirSync(absoluteSource, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(absoluteSource, entry.name))
      .filter(predicate)
      .sort(compareNames)

    collected.push(...entries)
  }

  return collected
}

async function saveBufferAsWebp(buffer, destination, width, quality) {
  const output = await sharp(buffer)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer()

  const normalizedDestination = normalizeBucketPath(destination)
  await bucket.file(normalizedDestination).save(output, {
    resumable: false,
    metadata: {
      contentType: 'image/webp',
      cacheControl: PUBLIC_CACHE_CONTROL,
    },
  })

  return normalizedDestination
}

async function saveLocalImageAsWebp(sourcePath, destination, width, quality) {
  const buffer = fs.readFileSync(sourcePath)
  return saveBufferAsWebp(buffer, destination, width, quality)
}

function ensureEmptyDirectory(directoryPath) {
  fs.rmSync(directoryPath, { recursive: true, force: true })
  fs.mkdirSync(directoryPath, { recursive: true })
}

function getProbeDuration(videoPath) {
  const output = runCommand('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    videoPath,
  ])

  const duration = Number.parseFloat(output)
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Could not determine duration for ${videoPath}`)
  }

  return duration
}

function extractFrame(videoPath, seconds, outputPath) {
  runCommand('ffmpeg', [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-ss',
    seconds.toFixed(3),
    '-i',
    videoPath,
    '-frames:v',
    '1',
    '-update',
    '1',
    outputPath,
  ])
}

function extractRepresentativeFrame(videoPath, outputPath) {
  runCommand('ffmpeg', [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    videoPath,
    '-vf',
    'thumbnail=240',
    '-frames:v',
    '1',
    '-update',
    '1',
    outputPath,
  ])
}

function getPosterTime(duration) {
  if (duration <= 0.25) return 0
  return Math.max(0, Math.min(duration - 0.05, duration * 0.18))
}

function extractPosterSource(videoPath, outputPath) {
  extractFrame(videoPath, getPosterTime(getProbeDuration(videoPath)), outputPath)
}

function transcodeToHls(videoPath, outputRoot) {
  const variantDir = path.join(outputRoot, '720p')
  fs.mkdirSync(variantDir, { recursive: true })

  const variantPlaylistPath = path.join(variantDir, 'index.m3u8')
  const segmentPattern = path.join(variantDir, 'segment_%03d.ts')

  runCommand('ffmpeg', [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    videoPath,
    '-map',
    '0:v:0',
    '-map',
    '0:a?',
    '-vf',
    'scale=w=1280:h=720:force_original_aspect_ratio=decrease:force_divisible_by=2',
    '-c:v',
    'libx264',
    '-preset',
    'fast',
    '-crf',
    '23',
    '-profile:v',
    'main',
    '-level',
    '4.0',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    '-ac',
    '2',
    '-ar',
    '48000',
    '-f',
    'hls',
    '-hls_time',
    '4',
    '-hls_playlist_type',
    'vod',
    '-hls_flags',
    'independent_segments',
    '-hls_segment_filename',
    segmentPattern,
    variantPlaylistPath,
  ])

  const masterPath = path.join(outputRoot, 'master.m3u8')
  fs.writeFileSync(
    masterPath,
    ['#EXTM3U', '#EXT-X-VERSION:3', '#EXT-X-STREAM-INF:BANDWIDTH=2800000', '720p/index.m3u8', ''].join('\n'),
    'utf8'
  )

  return masterPath
}

function rewritePlaylistWithAbsoluteUrls(playlistPath, resolveUrl) {
  const contents = fs.readFileSync(playlistPath, 'utf8')
  const rewritten = contents
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) {
        return line
      }

      return resolveUrl(trimmed)
    })
    .join('\n')

  fs.writeFileSync(playlistPath, rewritten, 'utf8')
}

function rewriteHlsPlaylistsToPublicUrls(localRoot, destinationRoot) {
  const normalizedRoot = normalizeBucketPath(destinationRoot)
  const masterPlaylistPath = path.join(localRoot, 'master.m3u8')
  const variantPlaylistPath = path.join(localRoot, '720p', 'index.m3u8')

  rewritePlaylistWithAbsoluteUrls(masterPlaylistPath, (line) =>
    getPublicStorageHttpUrl(`${normalizedRoot}/${line}`)
  )

  rewritePlaylistWithAbsoluteUrls(variantPlaylistPath, (line) =>
    getPublicStorageHttpUrl(`${normalizedRoot}/720p/${line}`)
  )
}

function getUploadMetadata(destination) {
  const extension = path.extname(destination).toLowerCase()

  if (extension === '.m3u8') {
    return {
      contentType: 'application/vnd.apple.mpegurl',
      cacheControl: MANIFEST_CACHE_CONTROL,
    }
  }

  if (extension === '.ts') {
    return {
      contentType: 'video/mp2t',
      cacheControl: PUBLIC_CACHE_CONTROL,
    }
  }

  if (extension === '.webp') {
    return {
      contentType: 'image/webp',
      cacheControl: PUBLIC_CACHE_CONTROL,
    }
  }

  return {
    cacheControl: PUBLIC_CACHE_CONTROL,
  }
}

async function uploadLocalFile(sourcePath, destination) {
  const normalizedDestination = normalizeBucketPath(destination)
  await bucket.upload(sourcePath, {
    destination: normalizedDestination,
    resumable: false,
    metadata: getUploadMetadata(normalizedDestination),
  })

  return normalizedDestination
}

async function uploadDirectory(sourceRoot, destinationRoot) {
  const uploaded = []
  const stack = [sourceRoot]

  while (stack.length > 0) {
    const currentPath = stack.pop()
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })

    for (const entry of entries) {
      const absolutePath = path.join(currentPath, entry.name)
      if (entry.isDirectory()) {
        stack.push(absolutePath)
        continue
      }

      const relativePath = path.relative(sourceRoot, absolutePath)
      const destination = normalizeBucketPath(path.join(destinationRoot, relativePath))
      await uploadLocalFile(absolutePath, destination)
      uploaded.push(destination)
    }
  }

  return uploaded
}

async function deletePrefix(prefix) {
  const normalizedPrefix = normalizeBucketPath(prefix)
  const [files] = await bucket.getFiles({ prefix: normalizedPrefix })
  await Promise.all(files.map((file) => file.delete({ ignoreNotFound: true })))
}

function createVideoId(index) {
  return `video-${String(index + 1).padStart(2, '0')}`
}

function cleanTitleFromFile(filePath) {
  return path
    .basename(filePath, path.extname(filePath))
    .replace(/[_-]+/g, ' ')
    .replace(/\((\d+)\)/g, ' $1')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim()
}

async function processImageSection(collection, section, collectionPrefix) {
  const sourceFiles = collectFiles(collection.root, section.sources, isImagePath)
  if (sourceFiles.length === 0) {
    throw new Error(`No image files found for ${collection.slug}/${section.id}`)
  }

  const previewPaths = []
  const fullPaths = []

  for (let index = 0; index < sourceFiles.length; index += 1) {
    const sourcePath = sourceFiles[index]
    const fileName = String(index + 1).padStart(2, '0')
    previewPaths.push(
      await saveLocalImageAsWebp(
        sourcePath,
        `${collectionPrefix}/sections/${section.id}/preview/${fileName}.webp`,
        SECTION_PREVIEW_WIDTH,
        82
      )
    )
    fullPaths.push(
      await saveLocalImageAsWebp(
        sourcePath,
        `${collectionPrefix}/sections/${section.id}/full/${fileName}.webp`,
        SECTION_FULL_WIDTH,
        88
      )
    )
  }

  return {
    heroSourcePath: sourceFiles[0],
    section: {
      id: section.id,
      title: section.title,
      kind: section.kind,
      previewPaths,
      fullPaths,
    },
  }
}

async function processVideoSection(collection, section, collectionPrefix, tempRoot) {
  const sourceFiles = collectFiles(collection.root, section.sources, isVideoPath)
  if (sourceFiles.length === 0) {
    throw new Error(`No video files found for ${collection.slug}/${section.id}`)
  }

  const previewPaths = []
  const fullPaths = []
  const videoEntries = []
  let heroSourcePath = ''

  for (let index = 0; index < sourceFiles.length; index += 1) {
    const sourcePath = sourceFiles[index]
    const videoId = createVideoId(index)
    const videoTempRoot = path.join(tempRoot, section.id, videoId)
    ensureEmptyDirectory(videoTempRoot)

    const posterSourcePath = path.join(videoTempRoot, 'poster-source.jpg')
    if (index === 0) {
      extractPosterSource(sourcePath, posterSourcePath)
    } else {
      extractRepresentativeFrame(sourcePath, posterSourcePath)
    }

    if (!heroSourcePath) {
      heroSourcePath = posterSourcePath
    }

    previewPaths.push(
      await saveLocalImageAsWebp(
        posterSourcePath,
        `${collectionPrefix}/sections/${section.id}/preview/${String(index + 1).padStart(2, '0')}.webp`,
        SECTION_PREVIEW_WIDTH,
        82
      )
    )

    fullPaths.push(
      await saveLocalImageAsWebp(
        posterSourcePath,
        `${collectionPrefix}/sections/${section.id}/full/${String(index + 1).padStart(2, '0')}.webp`,
        VIDEO_POSTER_FULL_WIDTH,
        88
      )
    )

    const posterPath = await saveLocalImageAsWebp(
      posterSourcePath,
      `${collectionPrefix}/videos/${section.id}/${videoId}/poster.webp`,
      VIDEO_POSTER_WIDTH,
      80
    )

    const hlsLocalRoot = path.join(videoTempRoot, 'hls')
    ensureEmptyDirectory(hlsLocalRoot)
    transcodeToHls(sourcePath, hlsLocalRoot)
    rewriteHlsPlaylistsToPublicUrls(hlsLocalRoot, `${collectionPrefix}/videos/${section.id}/${videoId}`)
    await uploadDirectory(hlsLocalRoot, `${collectionPrefix}/videos/${section.id}/${videoId}`)

    const fileName = path.basename(sourcePath)
    videoEntries.push({
      id: videoId,
      title: section.videoTitleOverrides?.[fileName] ?? cleanTitleFromFile(sourcePath),
      posterPath,
      hlsManifestPath: `${collectionPrefix}/videos/${section.id}/${videoId}/master.m3u8`,
      order: index,
    })
  }

  return {
    heroSourcePath,
    section: {
      id: section.id,
      title: section.title,
      kind: section.kind,
      previewPaths,
      fullPaths,
      videoEntries,
    },
  }
}

async function promoteCollectionAssets(collection) {
  const collectionPrefix = `portfolios/design/${collection.primaryTalentId}/${collection.slug}`
  await deletePrefix(collectionPrefix)

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), `${collection.slug}-`))

  try {
    let heroSourcePath = ''
    const designSections = []

    for (const section of collection.sections) {
      const result =
        section.kind === 'images'
          ? await processImageSection(collection, section, collectionPrefix)
          : await processVideoSection(collection, section, collectionPrefix, tempRoot)

      if (!heroSourcePath) {
        heroSourcePath = result.heroSourcePath
      }

      designSections.push(result.section)
    }

    if (!heroSourcePath) {
      throw new Error(`Could not determine hero source for ${collection.slug}`)
    }

    const thumbnailPath = await saveLocalImageAsWebp(
      heroSourcePath,
      `${collectionPrefix}/thumb/thumb.webp`,
      THUMB_WIDTH,
      74
    )
    const heroPath = await saveLocalImageAsWebp(
      heroSourcePath,
      `${collectionPrefix}/hero/hero.webp`,
      HERO_WIDTH,
      84
    )
    const heroLightboxPath = await saveLocalImageAsWebp(
      heroSourcePath,
      `${collectionPrefix}/hero/full.webp`,
      HERO_LIGHTBOX_WIDTH,
      90
    )

    return {
      thumbnailPath,
      heroPath,
      heroLightboxPath,
      galleryPaths: designSections.flatMap((section) => section.previewPaths),
      galleryLightboxPaths: designSections.flatMap((section) => section.fullPaths),
      designSections,
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true })
  }
}

async function upsertDesignDocs(collection, assets) {
  const summaryDoc = {
    id: collection.id,
    slug: collection.slug,
    service: 'design',
    type: 'design',
    category: collection.category,
    title: collection.title,
    shortDescription: collection.shortDescription,
    thumbnailPath: assets.thumbnailPath,
    primaryTalentId: collection.primaryTalentId,
    collaboratorTalentIds: [],
    clientName: collection.clientName,
    clientLogo: collection.clientLogo,
    date: collection.date,
    featured: collection.featured,
    tags: collection.tags,
    mediaKind: 'image-gallery',
    published: true,
    order: collection.order,
  }

  if (!collection.clientLogo) {
    delete summaryDoc.clientLogo
  }

  await db.collection('portfolioSummaries').doc(collection.slug).set(summaryDoc)

  await db.collection('portfolioDetails').doc(collection.slug).set({
    slug: collection.slug,
    service: 'design',
    primaryTalentId: collection.primaryTalentId,
    fullDescription: collection.fullDescription,
    heroPath: assets.heroPath,
    heroLightboxPath: assets.heroLightboxPath,
    galleryPaths: assets.galleryPaths,
    galleryLightboxPaths: assets.galleryLightboxPaths,
    mediaKind: 'image-gallery',
    designSections: assets.designSections,
    caseStudyCredit: collection.caseStudyCredit,
    published: true,
  })
}

async function unpublishLegacyDesignDocs(activeSlugs) {
  const [summarySnapshot, detailSnapshot] = await Promise.all([
    db.collection('portfolioSummaries').where('service', '==', 'design').get(),
    db.collection('portfolioDetails').where('service', '==', 'design').get(),
  ])

  for (const doc of summarySnapshot.docs) {
    if (activeSlugs.has(doc.id)) continue
    await doc.ref.set({ published: false }, { merge: true })
  }

  for (const doc of detailSnapshot.docs) {
    if (activeSlugs.has(doc.id)) continue
    await doc.ref.set({ published: false }, { merge: true })
  }
}

function assertSourceShape() {
  for (const collection of DESIGN_COLLECTIONS) {
    assertPathExists(collection.root)

    for (const section of collection.sections) {
      const files =
        section.kind === 'images'
          ? collectFiles(collection.root, section.sources, isImagePath)
          : collectFiles(collection.root, section.sources, isVideoPath)

      if (files.length === 0) {
        throw new Error(`No source files found for ${collection.slug}/${section.id}`)
      }
    }
  }
}

async function main() {
  await assertFirestoreAvailable()
  assertSourceShape()

  for (const collection of DESIGN_COLLECTIONS) {
    console.log(`Promoting design collection ${collection.slug}`)
    const assets = await promoteCollectionAssets(collection)
    await upsertDesignDocs(collection, assets)
    console.log(`Upserted design collection ${collection.slug}`)
  }

  await unpublishLegacyDesignDocs(new Set(DESIGN_COLLECTIONS.map((collection) => collection.slug)))
  console.log('Graphic design import complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const sharp = require('sharp')
const { getFirestoreDb, getStorageBucket } = require('./firebase-admin.cjs')

const db = getFirestoreDb()
const bucket = getStorageBucket()

const SOURCE_ROOT = 'D:\\Constantia\\Content\\Videography\\Youssef_Azzouggarh'
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.m4v'])
const PUBLIC_CACHE_CONTROL = 'public, max-age=31536000, immutable'
const MANIFEST_CACHE_CONTROL = 'public, max-age=60'
const THUMB_WIDTH = 720
const THUMB_QUALITY = 72
const POSTER_WIDTH = 1600
const POSTER_QUALITY = 82
const PREVIEW_WIDTH = 960
const PREVIEW_QUALITY = 76
const FULL_WIDTH = 1800
const FULL_QUALITY = 84
const GALLERY_FRAME_COUNT = 6

const VIDEO_PROJECTS = [
  {
    kind: 'grouped',
    id: 'advertising-video-collection',
    slug: 'advertising-video-collection',
    title: 'Advertising Video Collection',
    category: 'advertising',
    shortDescription:
      'A grouped campaign collection spanning compact ad cuts, product-led edits, and sharper commercial pacing.',
    fullDescription:
      'Advertising Video Collection brings together a set of short commercial cuts built for direct visual impact. The project is presented as one grouped case study because the pieces work as a campaign lane rather than standalone flagship films, showing how product framing, timing, and finish shift across multiple ad formats while staying under one authored video approach.',
    tags: ['advertising', 'commercial video', 'campaign cuts', 'brand content'],
    featured: true,
    order: 0,
    date: '2025',
    sharedThumbnailSource: 'ads_thumbnail.png',
    videos: [
      { file: '1.mp4', title: 'Ad Cut 1' },
      { file: 'ADS 2.mp4', title: 'Ad Cut 2' },
      { file: '3.mp4', title: 'Ad Cut 3' },
      { file: 'dofaa final video.mp4', title: 'Dofaa Final Video' },
      { file: 'estheplus.mp4', title: 'Estheplus' },
      { file: 'speed ramping baymoh final.mp4', title: 'Speed Ramping Baymoh Final' },
    ],
  },
  {
    kind: 'single',
    id: 'tourism-tv-show-trailer',
    slug: 'tourism-tv-show-trailer',
    sourceFile: path.join('horisontal videos', 'Tourism TV Show Trailer.mov'),
    title: 'Tourism TV Show Trailer',
    category: 'documentary',
    shortDescription:
      'A destination-led trailer cut built around travel atmosphere, forward motion, and broadcast-style pacing.',
    fullDescription:
      'Tourism TV Show Trailer is a travel-facing promo built to compress landscape, movement, and anticipation into a concise teaser format. The film leans on clear momentum, location contrast, and selective reveal, giving the piece the feel of a broadcast trailer rather than a loose tourism montage.',
    tags: ['tourism', 'travel trailer', 'broadcast promo', 'destination film'],
    featured: true,
    order: 1,
    date: '2023',
  },
  {
    kind: 'single',
    id: 'private-mountain-retreat-villa',
    slug: 'private-mountain-retreat-villa',
    sourceFile: path.join('horisontal videos', 'Private Mountain Retreat Villa.mp4'),
    title: 'Private Mountain Retreat Villa',
    category: 'advertising',
    shortDescription:
      'A cinematic hospitality film capturing privacy, scale, and the atmosphere of a high-end mountain retreat.',
    fullDescription:
      'Private Mountain Retreat Villa focuses on how a hospitality property is felt before it is explained. The piece moves between scale, architecture, and quiet detail, using aerial coverage and measured interior rhythm to make the location feel secluded, premium, and fully intentional.',
    tags: ['hospitality', 'villa film', 'drone coverage', 'luxury property'],
    featured: true,
    order: 2,
    date: '2025',
  },
  {
    kind: 'single',
    id: 'tamadot-video',
    slug: 'tamadot-video',
    sourceFile: path.join('horisontal videos', 'Tamadot video.mp4'),
    title: 'Tamadot Video',
    category: 'advertising',
    shortDescription:
      'A hospitality-led cut centered on mood, architecture, and the pace of a high-end guest experience.',
    fullDescription:
      'Tamadot Video is built around ambience and controlled visual pacing rather than hard sell messaging. The edit emphasizes material detail, spatial flow, and a calmer cinematic rhythm, making the property feel immersive and considered from the first frame onward.',
    tags: ['hospitality', 'resort film', 'luxury travel', 'cinematic edit'],
    featured: true,
    order: 3,
    date: '2024',
  },
  {
    kind: 'single',
    id: 'private-villa-drone-and-interior-coverage',
    slug: 'private-villa-drone-and-interior-coverage',
    sourceFile: path.join('horisontal videos', 'Private Villa Drone and Interior Coverage.mp4'),
    title: 'Private Villa Drone and Interior Coverage',
    category: 'advertising',
    shortDescription:
      'A property-focused film balancing aerial scope with interior detail and clean commercial movement.',
    fullDescription:
      'Private Villa Drone and Interior Coverage is a location film built to move smoothly between broad aerial context and more intimate interior framing. The project highlights how drone footage and grounded camera movement can work together to present a property with clarity and premium control.',
    tags: ['property film', 'drone video', 'interior coverage', 'commercial video'],
    featured: false,
    order: 4,
    date: '2025',
  },
  {
    kind: 'single',
    id: 'luxury-jacuzzi-suite-video',
    slug: 'luxury-jacuzzi-suite-video',
    sourceFile: path.join('horisontal videos', 'Luxury Jacuzzi Suite Video.mp4'),
    title: 'Luxury Jacuzzi Suite Video',
    category: 'advertising',
    shortDescription:
      'A short hospitality piece focused on suite detail, texture, and a restrained sense of luxury.',
    fullDescription:
      'Luxury Jacuzzi Suite Video narrows in on the premium details that define a hospitality stay: texture, lighting, material, and the pace at which those details are revealed. The edit stays compact and controlled, presenting the suite with clarity rather than excess.',
    tags: ['suite showcase', 'hospitality video', 'luxury interior', 'property marketing'],
    featured: false,
    order: 5,
    date: '2025',
  },
  {
    kind: 'single',
    id: 'magical-gala-evening',
    slug: 'magical-gala-evening',
    sourceFile: path.join('horisontal videos', 'Magical Gala Evening.mov'),
    title: 'Magical Gala Evening',
    category: 'events',
    shortDescription:
      'An event film shaped around evening ambience, guest energy, and a polished gala atmosphere.',
    fullDescription:
      'Magical Gala Evening captures a live event through atmosphere first: lighting, movement, and the social tempo of the night. The cut keeps the sense of occasion intact while maintaining a clean editorial rhythm, giving the evening a more cinematic finish than standard coverage.',
    tags: ['event film', 'gala coverage', 'live atmosphere', 'cinematic edit'],
    featured: false,
    order: 6,
    date: '2024',
  },
  {
    kind: 'single',
    id: 'ahwach-folklore-video',
    slug: 'ahwach-folklore-video',
    sourceFile: path.join('horisontal videos', 'Ahwach Folklore Video.mp4'),
    title: 'Ahwach Folklore Video',
    category: 'events',
    shortDescription:
      'A cultural performance film built around rhythm, costume, and the collective force of live folklore.',
    fullDescription:
      'Ahwach Folklore Video documents a performance setting with attention to cadence, costume, and crowd rhythm. Rather than flattening the event into generic coverage, the edit keeps its cultural texture visible, letting the movement and staging carry the film forward.',
    tags: ['folklore', 'performance film', 'culture', 'event coverage'],
    featured: false,
    order: 7,
    date: '2024',
  },
  {
    kind: 'single',
    id: 'the-redrock-final-project',
    slug: 'the-redrock-final-project',
    sourceFile: path.join('horisontal videos', 'The Redrock Final Project .mp4'),
    title: 'The Redrock Final Project',
    category: 'advertising',
    shortDescription:
      'A polished commercial cut focused on atmosphere, location presence, and confident visual pacing.',
    fullDescription:
      'The Redrock Final Project is a final-form branded film shaped around location character and a steady cinematic tempo. The edit prioritizes mood, transitions, and a clean sense of progression, giving the project a premium finish without overloading the frame.',
    tags: ['brand film', 'location shoot', 'commercial edit', 'cinematic pacing'],
    featured: false,
    order: 8,
    date: '2025',
  },
  {
    kind: 'single',
    id: 'kabana-final-video',
    slug: 'kabana-final-video',
    sourceFile: path.join('horisontal videos', 'KABANA FINAL VIDEO.mp4'),
    title: 'Kabana Final Video',
    category: 'brand',
    shortDescription:
      'A venue-led film built around movement, tone, and a sharper commercial presentation of place.',
    fullDescription:
      'Kabana Final Video turns a location-driven shoot into a concise branded cut with a stronger sense of mood and momentum. The film balances spatial reveal with editorial control, presenting the venue as an experience rather than a simple walkthrough.',
    tags: ['venue film', 'brand video', 'commercial edit', 'location showcase'],
    featured: false,
    order: 9,
    date: '2025',
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

function assertFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required source file not found: ${filePath}`)
  }
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

async function saveBufferAsWebp(buffer, destination, width, quality, enhance = false) {
  let pipeline = sharp(buffer).rotate()

  if (enhance) {
    pipeline = pipeline.modulate({ brightness: 1.06, saturation: 1.05 }).linear(1.03, -3)
  }

  const output = await pipeline
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

async function saveLocalImageAsWebp(sourcePath, destination, width, quality, enhance = false) {
  const buffer = fs.readFileSync(sourcePath)
  return saveBufferAsWebp(buffer, destination, width, quality, enhance)
}

function createVideoId(index) {
  return `video-${String(index + 1).padStart(2, '0')}`
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

function extractRepresentativeMiddleFrame(videoPath, outputPath) {
  const duration = getProbeDuration(videoPath)
  const clipStart = duration / 3
  const clipDuration = Math.max(duration / 3, 0.25)

  runCommand('ffmpeg', [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-ss',
    clipStart.toFixed(3),
    '-t',
    clipDuration.toFixed(3),
    '-i',
    videoPath,
    '-vf',
    'thumbnail=180',
    '-frames:v',
    '1',
    '-update',
    '1',
    outputPath,
  ])
}

function buildStoryboardTimes(duration, count) {
  const startFraction = 0.18
  const span = 0.64

  return Array.from({ length: count }, (_, index) => {
    const progress = (index + 1) / (count + 1)
    return duration * (startFraction + progress * span)
  })
}

function ensureEmptyDirectory(directoryPath) {
  fs.rmSync(directoryPath, { recursive: true, force: true })
  fs.mkdirSync(directoryPath, { recursive: true })
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

async function promoteSingleVideoProjectAssets(project) {
  const sourcePath = path.join(SOURCE_ROOT, project.sourceFile)
  const projectPrefix = `portfolios/video/${project.slug}`
  assertFileExists(sourcePath)

  await deletePrefix(projectPrefix)

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), `${project.slug}-`))

  try {
    const duration = getProbeDuration(sourcePath)
    const posterSourcePath = path.join(tempRoot, 'poster-source.jpg')
    extractRepresentativeMiddleFrame(sourcePath, posterSourcePath)

    const thumbnailPath = await saveLocalImageAsWebp(
      posterSourcePath,
      `${projectPrefix}/thumb/thumb.webp`,
      THUMB_WIDTH,
      THUMB_QUALITY,
      true
    )

    const posterPath = await saveLocalImageAsWebp(
      posterSourcePath,
      `${projectPrefix}/poster/poster.webp`,
      POSTER_WIDTH,
      POSTER_QUALITY,
      true
    )

    const hlsLocalRoot = path.join(tempRoot, 'hls')
    ensureEmptyDirectory(hlsLocalRoot)
    transcodeToHls(sourcePath, hlsLocalRoot)
    rewriteHlsPlaylistsToPublicUrls(hlsLocalRoot, `${projectPrefix}/video`)
    await uploadDirectory(hlsLocalRoot, `${projectPrefix}/video`)

    const galleryPaths = []
    const galleryLightboxPaths = []
    const storyboardTimes = buildStoryboardTimes(duration, GALLERY_FRAME_COUNT)

    for (let index = 0; index < storyboardTimes.length; index += 1) {
      const frameNumber = String(index + 1).padStart(2, '0')
      const frameSourcePath = path.join(tempRoot, `frame-${frameNumber}.jpg`)
      extractFrame(sourcePath, storyboardTimes[index], frameSourcePath)

      const previewPath = await saveLocalImageAsWebp(
        frameSourcePath,
        `${projectPrefix}/gallery/${frameNumber}.webp`,
        PREVIEW_WIDTH,
        PREVIEW_QUALITY
      )
      const fullPath = await saveLocalImageAsWebp(
        frameSourcePath,
        `${projectPrefix}/gallery/full/${frameNumber}.webp`,
        FULL_WIDTH,
        FULL_QUALITY
      )

      galleryPaths.push(previewPath)
      galleryLightboxPaths.push(fullPath)
    }

    return {
      thumbnailPath,
      posterPath,
      heroPath: posterPath,
      hlsManifestPath: `${projectPrefix}/video/master.m3u8`,
      galleryPaths,
      galleryLightboxPaths,
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true })
  }
}

async function buildGroupedVideoEntries(project, tempRoot) {
  const projectPrefix = `portfolios/video/${project.slug}`
  const videoEntries = []

  for (let index = 0; index < project.videos.length; index += 1) {
    const video = project.videos[index]
    const sourcePath = path.join(SOURCE_ROOT, 'ad videos', video.file)
    const videoId = createVideoId(index)
    const videoTempRoot = path.join(tempRoot, videoId)
    ensureEmptyDirectory(videoTempRoot)

    const posterSourcePath = path.join(videoTempRoot, 'poster-source.jpg')
    extractRepresentativeMiddleFrame(sourcePath, posterSourcePath)

    const posterPath = await saveLocalImageAsWebp(
      posterSourcePath,
      `${projectPrefix}/videos/${videoId}/poster.webp`,
      PREVIEW_WIDTH,
      PREVIEW_QUALITY
    )

    const hlsLocalRoot = path.join(videoTempRoot, 'hls')
    ensureEmptyDirectory(hlsLocalRoot)
    transcodeToHls(sourcePath, hlsLocalRoot)
    rewriteHlsPlaylistsToPublicUrls(hlsLocalRoot, `${projectPrefix}/videos/${videoId}`)
    await uploadDirectory(hlsLocalRoot, `${projectPrefix}/videos/${videoId}`)

    videoEntries.push({
      id: videoId,
      title: video.title,
      posterPath,
      hlsManifestPath: `${projectPrefix}/videos/${videoId}/master.m3u8`,
      order: index,
    })
  }

  return videoEntries
}

async function promoteGroupedVideoProjectAssets(project) {
  const projectPrefix = `portfolios/video/${project.slug}`
  const thumbnailSourcePath = path.join(SOURCE_ROOT, project.sharedThumbnailSource)
  assertFileExists(thumbnailSourcePath)

  await deletePrefix(projectPrefix)

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), `${project.slug}-`))

  try {
    const thumbnailPath = await saveLocalImageAsWebp(
      thumbnailSourcePath,
      `${projectPrefix}/thumb/thumb.webp`,
      THUMB_WIDTH,
      THUMB_QUALITY
    )

    const posterPath = await saveLocalImageAsWebp(
      thumbnailSourcePath,
      `${projectPrefix}/poster/poster.webp`,
      POSTER_WIDTH,
      POSTER_QUALITY
    )

    const videoEntries = await buildGroupedVideoEntries(project, tempRoot)

    return {
      thumbnailPath,
      posterPath,
      heroPath: posterPath,
      galleryPaths: [],
      galleryLightboxPaths: [],
      videoEntries,
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true })
  }
}

async function promoteProjectAssets(project) {
  if (project.kind === 'grouped') {
    return promoteGroupedVideoProjectAssets(project)
  }

  return promoteSingleVideoProjectAssets(project)
}

async function upsertVideoDocs(project, assets) {
  const summaryDoc = {
    id: project.id,
    slug: project.slug,
    service: 'video',
    type: 'video',
    category: project.category,
    title: project.title,
    shortDescription: project.shortDescription,
    thumbnailPath: assets.thumbnailPath,
    posterPath: assets.posterPath,
    primaryTalentId: 'youssef-azzouggarh',
    collaboratorTalentIds: [],
    clientName: '',
    date: project.date,
    featured: project.featured,
    tags: project.tags,
    mediaKind: 'storage-video',
    published: true,
    order: project.order,
  }

  await db.collection('portfolioSummaries').doc(project.slug).set(summaryDoc)

  const detailDoc = {
    slug: project.slug,
    service: 'video',
    primaryTalentId: 'youssef-azzouggarh',
    fullDescription: project.fullDescription,
    heroPath: assets.heroPath,
    galleryPaths: assets.galleryPaths,
    galleryLightboxPaths: assets.galleryLightboxPaths,
    mediaKind: 'storage-video',
    posterPath: assets.posterPath,
    caseStudyCredit: 'Videographer / Director',
    published: true,
  }

  if (assets.hlsManifestPath) {
    detailDoc.hlsManifestPath = assets.hlsManifestPath
  }

  if (assets.videoEntries?.length) {
    detailDoc.videoEntries = assets.videoEntries
  }

  await db.collection('portfolioDetails').doc(project.slug).set(detailDoc)
}

async function refreshYoussefTalentProfile() {
  await db.collection('talents').doc('youssef-azzouggarh').set(
    {
      role: 'Chief Motion & Videography',
      shortBio:
        'Motion and video creative shaping reels, brand films, and campaign cuts with control, tempo, and visual clarity.',
      fullBio:
        "Youssef Azzouggarh leads motion and videography within Constantia's visual practice. His work moves between brand-led films, hospitality cuts, trailers, reels, and motion systems, with an emphasis on clean pacing, visual control, and a disciplined finish across campaign surfaces. A fuller biography and selected case studies will be added soon.",
      skills: [
        'Motion Graphics',
        'Videography',
        'Commercial Video',
        'Hospitality Films',
        'Animation Direction',
        'Brand Motion Systems',
        'Title Sequences',
        'Transition Design',
        'Social Reels',
      ],
      services: ['animation', 'video'],
      published: true,
    },
    { merge: true }
  )
}

async function unpublishLegacyVideoDocs(activeSlugs) {
  const [summarySnapshot, detailSnapshot] = await Promise.all([
    db.collection('portfolioSummaries').where('service', '==', 'video').get(),
    db.collection('portfolioDetails').where('service', '==', 'video').get(),
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
  assertFileExists(SOURCE_ROOT)

  for (const project of VIDEO_PROJECTS) {
    if (project.kind === 'grouped') {
      assertFileExists(path.join(SOURCE_ROOT, project.sharedThumbnailSource))

      for (const video of project.videos) {
        const sourcePath = path.join(SOURCE_ROOT, 'ad videos', video.file)
        assertFileExists(sourcePath)

        if (!VIDEO_EXTENSIONS.has(path.extname(sourcePath).toLowerCase())) {
          throw new Error(`Unsupported video extension for ${sourcePath}`)
        }
      }

      continue
    }

    const sourcePath = path.join(SOURCE_ROOT, project.sourceFile)
    assertFileExists(sourcePath)

    if (!VIDEO_EXTENSIONS.has(path.extname(sourcePath).toLowerCase())) {
      throw new Error(`Unsupported video extension for ${sourcePath}`)
    }
  }
}

async function main() {
  await assertFirestoreAvailable()
  assertSourceShape()
  await refreshYoussefTalentProfile()

  for (const project of VIDEO_PROJECTS) {
    console.log(`Promoting videography project ${project.slug}`)
    const assets = await promoteProjectAssets(project)
    await upsertVideoDocs(project, assets)
    console.log(`Upserted videography project ${project.slug}`)
  }

  await unpublishLegacyVideoDocs(new Set(VIDEO_PROJECTS.map((project) => project.slug)))
  console.log('Videography portfolio import complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

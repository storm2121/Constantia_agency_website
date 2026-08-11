/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const sharp = require('sharp')
const { getFirestoreDb, getStorageBucket } = require('./firebase-admin.cjs')

const db = getFirestoreDb()
const bucket = getStorageBucket()

const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.m4v'])
const PUBLIC_CACHE_CONTROL = 'public, max-age=31536000, immutable'
const MANIFEST_CACHE_CONTROL = 'public, max-age=60'
const THUMB_WIDTH = 720
const THUMB_QUALITY = 72
const POSTER_WIDTH = 1600
const POSTER_QUALITY = 80
const VIDEO_POSTER_WIDTH = 960
const VIDEO_POSTER_QUALITY = 78
const POSTER_FRACTION = 0.18

const MOTION_PROJECTS = [
  {
    id: 'personal-brands-motion-series',
    slug: 'personal-brands-motion-series',
    title: 'Personal Brands Motion Series',
    sourceRoot: 'D:\\Constantia\\Content\\Motion graphics\\Youssef Azzouggarh',
    folders: ['Personal Brands'],
    heroVideo: path.join('Personal Brands', 'baymoh video.mp4'),
    maxVideos: 6,
    thumbnailMode: 'hero-frame',
    heroFrameStrategy: 'representative',
    videoPosterStrategy: 'representative',
    primaryTalentId: 'youssef-azzouggarh',
    caseStudyCredit: 'Motion Designer / Editor',
    clientName: '',
    clientLogo: undefined,
    date: '2025',
    shortDescription:
      'A curated motion series built for personal brands through polished reels, speaking presence, and high-control edit rhythm.',
    fullDescription:
      'Personal Brands Motion Series gathers a set of motion-led social edits built around personality, polish, and direct audience communication. The work emphasizes presence, pacing, and visual control across short-form reels, turning personality-driven footage into sharper, more cinematic brand communication.',
    category: 'brand',
    featured: true,
    order: 0,
    tags: ['motion graphics', 'personal branding', 'social reels', 'brand storytelling'],
    videoTitleOverrides: {
      '17 MAR V1.mp4': '17 Mar Reel',
      '26 - 03 - 2025.mp4': 'March Personal Reel',
      'baymoh video.mp4': 'Baymoh Personal Brand Reel',
      'bBoadkast teste video.mp4': 'Broadcast Test Reel',
      'behind the scene 2.mp4': 'Behind the Scenes Reel',
      'Blépharoplastie.mp4': 'Blépharoplastie Reel',
    },
  },
  {
    id: 'sports-motion-series',
    slug: 'sports-motion-series',
    title: 'Sports Motion Series',
    sourceRoot: 'D:\\Constantia\\Content\\Motion graphics\\Youssef Azzouggarh',
    folders: ['Sports Videos'],
    heroVideo: path.join('Sports Videos', 'final video (3).mp4'),
    thumbnailVideo: path.join('Sports Videos', 'final video (4).mp4'),
    maxVideos: 6,
    thumbnailMode: 'hero-frame',
    heroFrameStrategy: 'representative',
    thumbnailFrameStrategy: 'representative',
    videoPosterStrategy: 'representative',
    primaryTalentId: 'youssef-azzouggarh',
    caseStudyCredit: 'Motion Designer / Editor',
    clientName: '',
    clientLogo: undefined,
    date: '2025',
    shortDescription:
      'A fast-cut motion collection shaped around sports energy, highlight pacing, and social-first competitive edits.',
    fullDescription:
      'Sports Motion Series brings together a set of high-energy sports edits designed for impact, momentum, and immediate visual clarity. The project focuses on timing, kinetic rhythm, and sharp visual emphasis, turning sports footage into compact reels that feel urgent, controlled, and built for fast audience attention.',
    category: 'social',
    featured: false,
    order: 1,
    tags: ['motion graphics', 'sports content', 'social reels', 'high-energy edits'],
    videoTitleOverrides: {
      'export video. by rgragui.mp4': 'Rgragui Sports Edit',
      'final video (1).mp4': 'Sports Highlight 1',
      'final video (2).mp4': 'Sports Highlight 2',
      'final video (3).mp4': 'Sports Highlight 3',
      'final video (4).mp4': 'Sports Highlight 4',
      'final video 7.mp4': 'Sports Highlight 7',
    },
  },
  {
    id: 'aui-explainers-gitex',
    slug: 'aui-explainers-gitex',
    title: 'AUI Explainers & GITEX Motion Series',
    sourceRoot: 'D:\\Constantia\\Content\\Motion graphics\\Ayoub Ahnay',
    sharedThumbnailPath: 'D:\\Constantia\\Content\\Motion graphics\\Ayoub Ahnay\\thumbnail.png',
    folders: ['AUI-Explainers', 'AUI-GITEX'],
    heroVideo: path.join('AUI-Explainers', 'AUI-Exchange-Explainer-1.mp4'),
    thumbnailMode: 'shared-image',
    heroFrameStrategy: 'time-fraction',
    videoPosterStrategy: 'time-fraction',
    primaryTalentId: 'ayoub-ahnay',
    caseStudyCredit: 'Motion Designer / Editor',
    clientName: 'Al Akhawayn University',
    clientLogo: '/images/clients/al-akhawayn.svg',
    date: '2024',
    shortDescription:
      'Motion-led communication pieces for AUI across academic explainers and event-facing digital promotion.',
    fullDescription:
      'AUI Explainers & GITEX Motion Series brings together academic explainer outputs and event-facing digital promotion into one motion-led case study. The work focuses on clarity, pacing, and institutional storytelling, using titles, transitions, and disciplined sequencing to make information feel concise, legible, and visually current across multiple campaign surfaces.',
    category: 'digital',
    featured: true,
    order: 2,
    tags: ['motion graphics', 'explainer', 'event promotion', 'education'],
    videoPosterOverrides: {
      'AUI-Master_s-Explainer-1.mp4': { seconds: 33 },
      'AUI-Master_s-Explainer-2.mp4': { seconds: 44 },
    },
  },
  {
    id: 'aui-open-day-womens-day',
    slug: 'aui-open-day-womens-day',
    title: "AUI Open Day & Women's Day Motion",
    sourceRoot: 'D:\\Constantia\\Content\\Motion graphics\\Ayoub Ahnay',
    sharedThumbnailPath: 'D:\\Constantia\\Content\\Motion graphics\\Ayoub Ahnay\\thumbnail.png',
    folders: ['AUI-Open-Day', 'AUI-Women_s-Day'],
    heroVideo: path.join('AUI-Open-Day', 'AUI OPEN DAY.mp4'),
    thumbnailMode: 'shared-image',
    heroFrameStrategy: 'time-fraction',
    videoPosterStrategy: 'time-fraction',
    primaryTalentId: 'ayoub-ahnay',
    caseStudyCredit: 'Motion Designer / Editor',
    clientName: 'Al Akhawayn University',
    clientLogo: '/images/clients/al-akhawayn.svg',
    date: '2024',
    shortDescription:
      'Motion pieces built for AUI event communication across campus-facing announcements and themed campaigns.',
    fullDescription:
      "AUI Open Day & Women's Day Motion combines two event-focused motion pieces built to announce, frame, and energize campus communication. The project emphasizes event identity, short-form pacing, and clean title systems, showing how restrained motion can sharpen promotional messaging without sacrificing atmosphere.",
    category: 'events',
    featured: false,
    order: 3,
    tags: ['motion graphics', 'event campaign', 'campus', 'announcement'],
  },
]

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

function compareNames(left, right) {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' })
}

function listVideosInFolder(project, folderName) {
  const folderPath = path.join(project.sourceRoot, folderName)
  assertFileExists(folderPath)

  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && VIDEO_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => ({
      name: entry.name,
      absolutePath: path.join(folderPath, entry.name),
      relativePath: path.join(folderName, entry.name),
    }))
    .sort((left, right) => compareNames(left.name, right.name))
}

function listProjectVideos(project) {
  const videos = project.folders.flatMap((folderName) => listVideosInFolder(project, folderName))
  if (typeof project.maxVideos === 'number') {
    return videos.slice(0, project.maxVideos)
  }

  return videos
}

function normalizeBucketPath(filePath) {
  return filePath.replace(/\\/g, '/')
}

function createVideoId(index) {
  return `video-${String(index + 1).padStart(2, '0')}`
}

function titleCaseWord(word) {
  if (!word) return word
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function cleanVideoTitle(project, fileName) {
  const override = project.videoTitleOverrides?.[fileName]
  if (override) {
    return override
  }

  return path
    .basename(fileName, path.extname(fileName))
    .replace(/^AA-\s*/i, '')
    .replace(/_s/gi, "'s")
    .replace(/[_-]+/g, ' ')
    .replace(/\((\d+)\)/g, ' $1')
    .split(/\s+/)
    .filter(Boolean)
    .map(titleCaseWord)
    .join(' ')
    .trim()
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

function getPosterTime(duration) {
  if (duration <= 0.25) return 0
  return Math.max(0, Math.min(duration - 0.05, duration * POSTER_FRACTION))
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

function extractPosterSource(project, videoPath, outputPath, strategy) {
  if (strategy && typeof strategy === 'object' && typeof strategy.seconds === 'number') {
    extractFrame(videoPath, strategy.seconds, outputPath)
    return
  }

  if (strategy === 'representative') {
    extractRepresentativeFrame(videoPath, outputPath)
    return
  }

  extractFrame(videoPath, getPosterTime(getProbeDuration(videoPath)), outputPath)
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

async function buildVideoEntries(project, videos, temporaryRoot) {
  const projectPrefix = `portfolios/motion/${project.slug}`
  const videoEntries = []

  for (let index = 0; index < videos.length; index += 1) {
    const video = videos[index]
    const videoId = createVideoId(index)
    const videoTempRoot = path.join(temporaryRoot, videoId)
    ensureEmptyDirectory(videoTempRoot)

    const posterFramePath = path.join(videoTempRoot, 'poster-source.jpg')
    const videoPosterStrategy = project.videoPosterOverrides?.[video.name] ?? project.videoPosterStrategy
    extractPosterSource(project, video.absolutePath, posterFramePath, videoPosterStrategy)

    const posterPath = await saveLocalImageAsWebp(
      posterFramePath,
      `${projectPrefix}/videos/${videoId}/poster.webp`,
      VIDEO_POSTER_WIDTH,
      VIDEO_POSTER_QUALITY
    )

    const hlsLocalRoot = path.join(videoTempRoot, 'hls')
    ensureEmptyDirectory(hlsLocalRoot)
    transcodeToHls(video.absolutePath, hlsLocalRoot)
    rewriteHlsPlaylistsToPublicUrls(hlsLocalRoot, `${projectPrefix}/videos/${videoId}`)
    await uploadDirectory(hlsLocalRoot, `${projectPrefix}/videos/${videoId}`)

    videoEntries.push({
      id: videoId,
      title: cleanVideoTitle(project, video.name),
      posterPath,
      hlsManifestPath: `${projectPrefix}/videos/${videoId}/master.m3u8`,
      order: index,
    })
  }

  return videoEntries
}

async function createProjectKeyArt(project, heroVideoPath, thumbnailVideoPath, tempRoot) {
  const posterSourcePath = path.join(tempRoot, 'hero-source.jpg')
  const thumbnailSourcePath = path.join(tempRoot, 'thumb-source.jpg')

  if (project.thumbnailMode === 'shared-image') {
    return {
      thumbnailSource: project.sharedThumbnailPath,
      posterSource: (() => {
        extractPosterSource(project, heroVideoPath, posterSourcePath, project.heroFrameStrategy)
        return posterSourcePath
      })(),
    }
  }

  extractPosterSource(
    project,
    thumbnailVideoPath,
    thumbnailSourcePath,
    project.thumbnailFrameStrategy ?? project.heroFrameStrategy
  )
  extractPosterSource(project, heroVideoPath, posterSourcePath, project.heroFrameStrategy)

  return {
    thumbnailSource: thumbnailSourcePath,
    posterSource: posterSourcePath,
  }
}

async function promoteProjectAssets(project, videos) {
  const projectPrefix = `portfolios/motion/${project.slug}`
  const heroVideoPath = path.join(project.sourceRoot, project.heroVideo)
  const thumbnailVideoPath = path.join(project.sourceRoot, project.thumbnailVideo ?? project.heroVideo)
  assertFileExists(heroVideoPath)
  assertFileExists(thumbnailVideoPath)

  await deletePrefix(projectPrefix)

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), `${project.slug}-`))

  try {
    const keyArt = await createProjectKeyArt(project, heroVideoPath, thumbnailVideoPath, tempRoot)

    const thumbPath = await saveLocalImageAsWebp(
      keyArt.thumbnailSource,
      `${projectPrefix}/thumb/thumb.webp`,
      THUMB_WIDTH,
      THUMB_QUALITY
    )

    const posterPath = await saveLocalImageAsWebp(
      keyArt.posterSource,
      `${projectPrefix}/poster/poster.webp`,
      POSTER_WIDTH,
      POSTER_QUALITY
    )

    const videoEntries = await buildVideoEntries(project, videos, tempRoot)
    const leadEntry = videoEntries.find((entry) => {
      return entry.title === cleanVideoTitle(project, path.basename(heroVideoPath))
    }) ?? videoEntries[0]

    return {
      thumbnailPath: thumbPath,
      posterPath,
      heroPath: posterPath,
      hlsManifestPath: leadEntry?.hlsManifestPath,
      galleryPaths: videoEntries.map((entry) => entry.posterPath),
      galleryLightboxPaths: videoEntries.map((entry) => entry.posterPath),
      videoEntries,
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true })
  }
}

async function upsertMotionDocs(project, assets) {
  const summaryDoc = {
    id: project.id,
    slug: project.slug,
    service: 'motion',
    type: 'animation',
    category: project.category,
    title: project.title,
    shortDescription: project.shortDescription,
    thumbnailPath: assets.thumbnailPath,
    posterPath: assets.posterPath,
    primaryTalentId: project.primaryTalentId,
    collaboratorTalentIds: [],
    clientName: project.clientName,
    clientLogo: project.clientLogo,
    date: project.date,
    featured: project.featured,
    tags: project.tags,
    mediaKind: 'storage-video',
    published: true,
    order: project.order,
  }

  if (!project.clientLogo) {
    delete summaryDoc.clientLogo
  }

  await db.collection('portfolioSummaries').doc(project.slug).set(summaryDoc)

  const detailDoc = {
    slug: project.slug,
    service: 'motion',
    primaryTalentId: project.primaryTalentId,
    fullDescription: project.fullDescription,
    heroPath: assets.heroPath,
    galleryPaths: assets.galleryPaths,
    galleryLightboxPaths: assets.galleryLightboxPaths,
    mediaKind: 'storage-video',
    posterPath: assets.posterPath,
    hlsManifestPath: assets.hlsManifestPath,
    videoEntries: assets.videoEntries,
    caseStudyCredit: project.caseStudyCredit,
    published: true,
  }

  await db.collection('portfolioDetails').doc(project.slug).set(detailDoc)
}

async function unpublishLegacyMotionDocs(activeSlugs) {
  const [summarySnapshot, detailSnapshot] = await Promise.all([
    db.collection('portfolioSummaries').where('service', '==', 'motion').get(),
    db.collection('portfolioDetails').where('service', '==', 'motion').get(),
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
  for (const project of MOTION_PROJECTS) {
    assertFileExists(project.sourceRoot)

    if (project.thumbnailMode === 'shared-image') {
      assertFileExists(project.sharedThumbnailPath)
    }

    for (const folder of project.folders) {
      const folderPath = path.join(project.sourceRoot, folder)
      assertFileExists(folderPath)
      const videos = listVideosInFolder(project, folder)
      if (videos.length === 0) {
        throw new Error(`No video files found in ${folderPath}`)
      }
    }

    const projectVideos = listProjectVideos(project)
    const availableVideoNames = new Set(projectVideos.map((video) => video.name))
    for (const overrideFileName of Object.keys(project.videoPosterOverrides ?? {})) {
      if (!availableVideoNames.has(overrideFileName)) {
        throw new Error(
          `Poster override source not found for ${project.slug}: ${overrideFileName}`
        )
      }
    }

    assertFileExists(path.join(project.sourceRoot, project.heroVideo))
    assertFileExists(path.join(project.sourceRoot, project.thumbnailVideo ?? project.heroVideo))
  }
}

async function main() {
  await assertFirestoreAvailable()
  assertSourceShape()

  const preparedProjects = MOTION_PROJECTS.map((project) => ({
    project,
    videos: listProjectVideos(project),
  }))

  for (const entry of preparedProjects) {
    console.log(`Promoting motion project ${entry.project.slug}`)
    const assets = await promoteProjectAssets(entry.project, entry.videos)
    await upsertMotionDocs(entry.project, assets)
    console.log(`Upserted motion project ${entry.project.slug}`)
  }

  await unpublishLegacyMotionDocs(new Set(MOTION_PROJECTS.map((project) => project.slug)))
  console.log('Motion portfolio import complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

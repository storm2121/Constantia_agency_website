/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('node:path')
const sharp = require('sharp')
const { getFirestoreDb, getStorageBucket } = require('./firebase-admin.cjs')

const bucket = getStorageBucket()
const db = getFirestoreDb()

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const PUBLIC_CACHE_CONTROL = 'public, max-age=31536000, immutable'
const THUMB_WIDTH = 720
const HERO_WIDTH = 1600
const HERO_LIGHTBOX_WIDTH = 2400
const GALLERY_PREVIEW_WIDTH = 960
const GALLERY_LIGHTBOX_WIDTH = 2200

const PHOTOGRAPHY_PROJECTS = [
  {
    id: 'epias-younes',
    slug: 'epias-younes',
    title: "BEYOUND THE SEA, Espias Malignos & Into the Evernight - L'ma3adine",
    sourcePrefix: 'epias_younes/',
    shortDescription:
      'A photography series exploring atmosphere, movement, and light through a live visual sequence.',
    fullDescription:
      'A photography series built around atmosphere, gesture, and the changing intensity of live presence. The work focuses on visual rhythm and stillness rather than narrative exposition, using composition and light to hold each frame with clarity.',
    category: 'events',
    featured: true,
    order: 0,
    tags: ['performance', 'atmosphere', 'live', 'photography'],
  },
  {
    id: 'perf-younes',
    slug: 'perf-younes',
    title: 'Jubantouja - French Institute of Agadir',
    sourcePrefix: 'perf_younes/',
    shortDescription:
      'A performance photography series observing rhythm, gesture, and stage presence through still frames.',
    fullDescription:
      'This photography series documents a live performance environment with an emphasis on timing, posture, and collective energy. Each image is treated as a self-contained composition, balancing documentary immediacy with a measured editorial sensibility.',
    category: 'events',
    featured: false,
    order: 1,
    tags: ['performance', 'stage', 'culture', 'photography'],
  },
  {
    id: 'street-younes',
    slug: 'street-younes',
    title: 'Street Photography',
    sourcePrefix: 'street_younes/',
    shortDescription:
      'A street photography series focused on fleeting moments, contrast, and urban texture.',
    fullDescription:
      'A street photography study centered on timing, human movement, and the visual texture of public space. The images are built from observation rather than staging, capturing brief alignments of light, architecture, and everyday presence.',
    category: 'documentary',
    featured: false,
    order: 2,
    tags: ['street', 'urban', 'documentary', 'photography'],
  },
]

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

function isImageObject(fileName) {
  return IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase())
}

function compareObjectNames(left, right) {
  return path
    .basename(left)
    .localeCompare(path.basename(right), undefined, {
      numeric: true,
      sensitivity: 'base',
    })
}

async function listSourceFiles(prefix) {
  const [files] = await bucket.getFiles({ prefix })
  return files
    .map((file) => file.name)
    .filter((fileName) => fileName !== prefix && isImageObject(fileName))
    .sort(compareObjectNames)
}

async function readObjectBuffer(objectPath) {
  const [buffer] = await bucket.file(objectPath).download()
  return buffer
}

function getDeterministicThumbnailIndex(project, totalCount) {
  const seed = project.slug.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return totalCount === 0 ? 0 : seed % totalCount
}

async function saveResizedWebp(buffer, destination, width, quality) {
  const output = await sharp(buffer)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer()

  await bucket.file(destination).save(output, {
    resumable: false,
    metadata: {
      contentType: 'image/webp',
      cacheControl: PUBLIC_CACHE_CONTROL,
    },
  })

  return destination
}

async function promoteProjectAssets(project, sourceFiles) {
  const thumbnailSourceIndex = getDeterministicThumbnailIndex(project, sourceFiles.length)
  const firstBuffer = await readObjectBuffer(sourceFiles[0])
  const thumbnailBuffer =
    thumbnailSourceIndex === 0
      ? firstBuffer
      : await readObjectBuffer(sourceFiles[thumbnailSourceIndex])
  const basePath = `portfolios/photo/${project.slug}`

  const thumbnailPath = await saveResizedWebp(
    thumbnailBuffer,
    `${basePath}/thumb/thumb.webp`,
    THUMB_WIDTH,
    72
  )
  const heroPath = await saveResizedWebp(firstBuffer, `${basePath}/hero/hero.webp`, HERO_WIDTH, 80)
  const heroLightboxPath = await saveResizedWebp(
    firstBuffer,
    `${basePath}/hero/full.webp`,
    HERO_LIGHTBOX_WIDTH,
    86
  )

  const galleryPaths = []
  const galleryLightboxPaths = []
  for (let index = 0; index < sourceFiles.length; index += 1) {
    const buffer = index === 0 ? firstBuffer : await readObjectBuffer(sourceFiles[index])
    const galleryPath = await saveResizedWebp(
      buffer,
      `${basePath}/gallery/${String(index + 1).padStart(2, '0')}.webp`
      ,
      GALLERY_PREVIEW_WIDTH,
      76
    )
    const galleryLightboxPath = await saveResizedWebp(
      buffer,
      `${basePath}/gallery/full/${String(index + 1).padStart(2, '0')}.webp`,
      GALLERY_LIGHTBOX_WIDTH,
      84
    )
    galleryPaths.push(galleryPath)
    galleryLightboxPaths.push(galleryLightboxPath)
  }

  return { thumbnailPath, heroPath, heroLightboxPath, galleryPaths, galleryLightboxPaths }
}

async function upsertPhotoDocs(project, assets) {
  await db.collection('portfolioSummaries').doc(project.slug).set({
    id: project.id,
    slug: project.slug,
    service: 'photo',
    type: 'photo',
    category: project.category,
    title: project.title,
    shortDescription: project.shortDescription,
    thumbnailPath: assets.thumbnailPath,
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    clientName: '',
    date: '2024',
    featured: project.featured,
    tags: project.tags,
    mediaKind: 'image-gallery',
    published: true,
    order: project.order,
  })

  await db.collection('portfolioDetails').doc(project.slug).set({
    slug: project.slug,
    service: 'photo',
    primaryTalentId: 'younes-arbani',
    fullDescription: project.fullDescription,
    heroPath: assets.heroPath,
    heroLightboxPath: assets.heroLightboxPath,
    galleryPaths: assets.galleryPaths,
    galleryLightboxPaths: assets.galleryLightboxPaths,
    mediaKind: 'image-gallery',
    caseStudyCredit: 'Photographer',
    published: true,
  })
}

async function unpublishLegacyPhotoDocs(activeSlugs) {
  const [summarySnapshot, detailSnapshot] = await Promise.all([
    db.collection('portfolioSummaries').where('service', '==', 'photo').get(),
    db.collection('portfolioDetails').where('service', '==', 'photo').get(),
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

async function main() {
  await assertFirestoreAvailable()

  const preparedProjects = []
  for (const project of PHOTOGRAPHY_PROJECTS) {
    const sourceFiles = await listSourceFiles(project.sourcePrefix)
    if (sourceFiles.length === 0) {
      throw new Error(`No image files found under source prefix "${project.sourcePrefix}"`)
    }

    preparedProjects.push({ project, sourceFiles })
  }

  for (const entry of preparedProjects) {
    console.log(`Promoting ${entry.project.sourcePrefix} -> ${entry.project.slug}`)
    const assets = await promoteProjectAssets(entry.project, entry.sourceFiles)
    await upsertPhotoDocs(entry.project, assets)
    console.log(`Upserted photography project ${entry.project.slug}`)
  }

  await unpublishLegacyPhotoDocs(
    new Set(PHOTOGRAPHY_PROJECTS.map((project) => project.slug))
  )

  console.log('Photography portfolio import complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

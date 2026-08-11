import 'server-only'

import { cache } from 'react'
import { z } from 'zod'
import {
  getFirebaseAdminFirestore,
  getFirebaseStoragePublicUrl,
  hasFirebaseAdminConfig,
} from '@/lib/firebase-admin'
import { projects as seedProjects } from '@/lib/data/projects'
import { talents as seedTalents } from '@/lib/data/talents'
import type {
  ClientRef,
  DesignSection,
  Project,
  ProjectCategory,
  ProjectMediaKind,
  ProjectVideoEntry,
  ServiceType,
  Talent,
  TalentSocialLinks,
} from '@/lib/types'
import {
  getServicePortfolioByProjectType,
  getServicePortfolioBySlug,
  isServicePortfolioWipOnly,
  isServicePortfolioSlug,
  type ServicePortfolioConfig,
  type ServicePortfolioSlug,
} from '@/lib/service-portfolios'

const SERVICE_TYPE_VALUES = ['photo', 'video', 'design', 'animation', 'web', 'strategy'] as const
const PROJECT_CATEGORY_VALUES = [
  'corporate',
  'events',
  'nature',
  'brand',
  'music',
  'social',
  'digital',
  'documentary',
  'advertising',
] as const
const SERVICE_SLUG_VALUES = ['photo', 'video', 'motion', 'design', 'web'] as const
const PROJECT_MEDIA_KIND_VALUES = ['image-gallery', 'storage-video', 'youtube-embed'] as const
const DESIGN_SECTION_KIND_VALUES = ['images', 'mixed', 'videos'] as const

const clientRefSchema = z.object({
  name: z.string(),
  logo: z.string(),
  url: z.string().optional(),
})

const talentDocSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  shortBio: z.string(),
  fullBio: z.string(),
  skills: z.array(z.string()),
  clients: z.array(clientRefSchema),
  imagePath: z.string(),
  social: z
    .object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      instagram: z.string().optional(),
      behance: z.string().optional(),
    })
    .optional(),
  services: z.array(z.enum(SERVICE_TYPE_VALUES)),
  order: z.number().int().nonnegative(),
  published: z.boolean().default(true),
})

const portfolioSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  service: z.enum(SERVICE_SLUG_VALUES).optional(),
  type: z.enum(SERVICE_TYPE_VALUES),
  category: z.enum(PROJECT_CATEGORY_VALUES),
  title: z.string(),
  shortDescription: z.string(),
  thumbnailPath: z.string(),
  posterPath: z.string().optional(),
  primaryTalentId: z.string().optional(),
  talentId: z.string().optional(),
  collaboratorTalentIds: z.array(z.string()).optional(),
  teamIds: z.array(z.string()).optional(),
  clientName: z.string(),
  clientLogo: z.string().optional(),
  date: z.string(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  mediaKind: z.enum(PROJECT_MEDIA_KIND_VALUES).default('image-gallery'),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
})

const portfolioVideoEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  posterPath: z.string(),
  hlsManifestPath: z.string(),
  order: z.number().int().default(0),
})

const portfolioDetailSchema = z.object({
  slug: z.string(),
  service: z.enum(SERVICE_SLUG_VALUES).optional(),
  primaryTalentId: z.string().optional(),
  talentId: z.string().optional(),
  fullDescription: z.string(),
  heroPath: z.string().optional(),
  heroLightboxPath: z.string().optional(),
  galleryPaths: z.array(z.string()).default([]),
  galleryLightboxPaths: z.array(z.string()).optional(),
  mediaKind: z.enum(PROJECT_MEDIA_KIND_VALUES).default('image-gallery'),
  posterPath: z.string().optional(),
  hlsManifestPath: z.string().optional(),
  youtubeVideoId: z.string().optional(),
  youtubeStartSeconds: z.number().int().nonnegative().optional(),
  videoEntries: z.array(portfolioVideoEntrySchema).optional(),
  designSections: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        kind: z.enum(DESIGN_SECTION_KIND_VALUES),
        previewPaths: z.array(z.string()).default([]),
        fullPaths: z.array(z.string()).default([]),
        videoEntries: z.array(portfolioVideoEntrySchema).optional(),
      })
    )
    .optional(),
  caseStudyCredit: z.string().optional(),
  published: z.boolean().default(true),
})

type PortfolioSummaryRecord = {
  project: Project
  service: ServicePortfolioSlug
  order: number
}

type PortfolioDetailRecord = {
  slug: string
  service: ServicePortfolioSlug
  primaryTalentId: string
  fullDescription: string
  heroImage: string
  heroLightboxImage?: string
  galleryImages: string[]
  galleryLightboxImages?: string[]
  mediaKind: ProjectMediaKind
  posterImage?: string
  hlsManifestPath?: string
  youtubeVideoId?: string
  youtubeStartSeconds?: number
  videoEntries?: ProjectVideoEntry[]
  designSections?: DesignSection[]
  caseStudyCredit?: string
}

type ContentSnapshot = {
  talents: Talent[]
  summaries: PortfolioSummaryRecord[]
  detailsBySlug: Record<string, PortfolioDetailRecord>
}

type PortfolioCaseStudy = {
  project: Project
  talent: Talent | null
  service: ServicePortfolioConfig
  heroImage: string
  heroLightboxImage?: string
  galleryImages: string[]
  galleryLightboxImages?: string[]
  mediaKind: ProjectMediaKind
  posterImage?: string
  hlsManifestPath?: string
  youtubeVideoId?: string
  youtubeStartSeconds?: number
  videoEntries?: ProjectVideoEntry[]
  designSections?: DesignSection[]
  caseStudyCredit?: string
}

function mergeProjectSummaryWithDetail(
  summary: PortfolioSummaryRecord,
  detail?: PortfolioDetailRecord
): Project {
  if (!detail) {
    return summary.project
  }

  return {
    ...summary.project,
    fullDescription: detail.fullDescription,
    heroImage: detail.heroImage,
    heroLightboxImage: detail.heroLightboxImage,
    gallery: detail.galleryImages,
    galleryLightbox: detail.galleryLightboxImages,
    mediaKind: detail.mediaKind,
    posterImage: detail.posterImage ?? summary.project.posterImage,
    hlsManifestPath: detail.hlsManifestPath,
    youtubeVideoId: detail.youtubeVideoId,
    youtubeStartSeconds: detail.youtubeStartSeconds,
    videoEntries: detail.videoEntries ?? summary.project.videoEntries,
    designSections: detail.designSections ?? summary.project.designSections,
    caseStudyCredit: detail.caseStudyCredit ?? summary.project.caseStudyCredit,
  }
}

function normalizeText(value: string) {
  return value
    .replace(/Ã¢â‚¬â€/g, '—')
    .replace(/Ã¢â‚¬â„¢/g, "'")
    .replace(/Ã¢â‚¬Å“/g, '"')
    .replace(/Ã¢â‚¬/g, '"')
    .replace(/Ãƒâ€š/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeStoragePath(path: string | undefined) {
  if (!path) return undefined
  return getFirebaseStoragePublicUrl(path)
}

function normalizeVideoEntries(entries: ProjectVideoEntry[] | undefined) {
  return entries
    ?.slice()
    .sort((left, right) => left.order - right.order)
    .map((entry) => ({
      ...entry,
      title: normalizeText(entry.title),
      posterPath: getFirebaseStoragePublicUrl(entry.posterPath),
      hlsManifestPath: getFirebaseStoragePublicUrl(entry.hlsManifestPath),
    }))
}

function normalizeDesignSections(sections: DesignSection[] | undefined) {
  return sections?.map((section) => ({
    ...section,
    title: normalizeText(section.title),
    previewPaths: section.previewPaths.map(getFirebaseStoragePublicUrl),
    fullPaths: section.fullPaths.map(getFirebaseStoragePublicUrl),
    videoEntries: normalizeVideoEntries(section.videoEntries),
  }))
}

function mapClientRef(client: ClientRef): ClientRef {
  return {
    ...client,
    name: normalizeText(client.name),
    logo: getFirebaseStoragePublicUrl(client.logo),
    url: client.url,
  }
}

function sanitizeTalent(talent: Talent): Talent {
  return {
    ...talent,
    name: normalizeText(talent.name),
    role: normalizeText(talent.role),
    shortBio: normalizeText(talent.shortBio),
    fullBio: normalizeText(talent.fullBio),
    skills: talent.skills.map(normalizeText),
    clients: talent.clients.map(mapClientRef),
    image: getFirebaseStoragePublicUrl(talent.image),
    social: talent.social,
  }
}

function sanitizeProject(project: Project): Project {
  return {
    ...project,
    title: normalizeText(project.title),
    shortDescription: normalizeText(project.shortDescription),
    fullDescription: normalizeText(project.fullDescription),
    thumbnail: getFirebaseStoragePublicUrl(project.thumbnail),
    gallery: project.gallery.map(getFirebaseStoragePublicUrl),
    heroImage: normalizeStoragePath(project.heroImage),
    posterImage: normalizeStoragePath(project.posterImage),
    hlsManifestPath: normalizeStoragePath(project.hlsManifestPath),
    videoEntries: normalizeVideoEntries(project.videoEntries),
    designSections: normalizeDesignSections(project.designSections),
    clientName: normalizeText(project.clientName),
    clientLogo: project.clientLogo ? getFirebaseStoragePublicUrl(project.clientLogo) : undefined,
    tags: project.tags.map(normalizeText),
    caseStudyCredit: project.caseStudyCredit ? normalizeText(project.caseStudyCredit) : undefined,
  }
}

function compareProjects(left: PortfolioSummaryRecord, right: PortfolioSummaryRecord) {
  if (left.project.featured !== right.project.featured) {
    return left.project.featured ? -1 : 1
  }

  if (left.order !== right.order) {
    return left.order - right.order
  }

  const yearLeft = Number.parseInt(left.project.date, 10)
  const yearRight = Number.parseInt(right.project.date, 10)

  if (Number.isFinite(yearLeft) && Number.isFinite(yearRight) && yearLeft !== yearRight) {
    return yearRight - yearLeft
  }

  return left.project.title.localeCompare(right.project.title)
}

function resolvePortfolioService(
  service: string | undefined,
  projectType: ServiceType
): ServicePortfolioSlug | null {
  if (service && isServicePortfolioSlug(service)) {
    return service
  }

  const derived = getServicePortfolioByProjectType(projectType)
  return derived?.slug ?? null
}

function resolvePrimaryTalentId(
  primaryTalentId: string | undefined,
  talentId: string | undefined,
  collaboratorTalentIds: string[] | undefined,
  teamIds: string[] | undefined
) {
  return primaryTalentId ?? talentId ?? collaboratorTalentIds?.[0] ?? teamIds?.[0] ?? ''
}

function resolveCollaboratorTalentIds(
  primaryTalentId: string,
  collaboratorTalentIds: string[] | undefined,
  teamIds: string[] | undefined
) {
  const source = collaboratorTalentIds ?? teamIds ?? []
  return source.filter((candidate, index, collection) => {
    return candidate !== primaryTalentId && collection.indexOf(candidate) === index
  })
}

function createLocalFallbackSnapshot(): ContentSnapshot {
  const talents = seedTalents.map(sanitizeTalent).sort((left, right) => left.order - right.order)

  const summaries: PortfolioSummaryRecord[] = seedProjects
    .map((project, index) => {
      const service = resolvePortfolioService(project.service, project.type)
      if (!service) return null

      return {
        service,
        order: index,
        project: sanitizeProject(project),
      }
    })
    .filter((entry): entry is PortfolioSummaryRecord => Boolean(entry))
    .sort(compareProjects)

  const detailsBySlug = summaries.reduce<Record<string, PortfolioDetailRecord>>((collection, summary) => {
    const source = seedProjects.find((project) => project.slug === summary.project.slug)
    if (!source) return collection

    collection[source.slug] = {
      slug: source.slug,
      service: summary.service,
      primaryTalentId: source.primaryTalentId,
      fullDescription: normalizeText(source.fullDescription),
      heroImage: getFirebaseStoragePublicUrl(source.heroImage ?? source.thumbnail),
      heroLightboxImage: normalizeStoragePath(source.heroLightboxImage),
      galleryImages: source.gallery.map(getFirebaseStoragePublicUrl),
      galleryLightboxImages: source.galleryLightbox?.map(getFirebaseStoragePublicUrl),
      mediaKind: source.mediaKind,
      posterImage: normalizeStoragePath(source.posterImage),
      hlsManifestPath: normalizeStoragePath(source.hlsManifestPath),
      youtubeVideoId: source.youtubeVideoId,
      youtubeStartSeconds: source.youtubeStartSeconds,
      videoEntries: normalizeVideoEntries(source.videoEntries),
      designSections: normalizeDesignSections(source.designSections),
      caseStudyCredit: source.caseStudyCredit ? normalizeText(source.caseStudyCredit) : undefined,
    }

    return collection
  }, {})

  return { talents, summaries, detailsBySlug }
}

async function loadFirebaseSnapshot(): Promise<ContentSnapshot | null> {
  if (!hasFirebaseAdminConfig()) {
    return null
  }

  try {
    const db = getFirebaseAdminFirestore()
    const [talentDocs, summaryDocs, detailDocs] = await Promise.all([
      db.collection('talents').where('published', '==', true).get(),
      db.collection('portfolioSummaries').where('published', '==', true).get(),
      db.collection('portfolioDetails').where('published', '==', true).get(),
    ])

    const talents = talentDocs.docs
      .map((doc) => talentDocSchema.safeParse(doc.data()))
      .filter((result) => result.success)
      .map((result) =>
        sanitizeTalent({
          id: result.data.id,
          slug: result.data.slug,
          name: result.data.name,
          role: result.data.role,
          shortBio: result.data.shortBio,
          fullBio: result.data.fullBio,
          skills: result.data.skills,
          clients: result.data.clients as ClientRef[],
          image: result.data.imagePath,
          social: result.data.social as TalentSocialLinks | undefined,
          services: result.data.services as ServiceType[],
          order: result.data.order,
        })
      )
      .sort((left, right) => left.order - right.order)

    const summaries = summaryDocs.docs
      .map((doc) => portfolioSummarySchema.safeParse(doc.data()))
      .filter((result) => result.success)
      .map((result) => {
        const data = result.data
        const service = resolvePortfolioService(data.service, data.type as ServiceType)
        if (!service) {
          return null
        }

        const primaryTalentId = resolvePrimaryTalentId(
          data.primaryTalentId,
          data.talentId,
          data.collaboratorTalentIds,
          data.teamIds
        )
        if (!primaryTalentId) {
          return null
        }

        const collaboratorTalentIds = resolveCollaboratorTalentIds(
          primaryTalentId,
          data.collaboratorTalentIds,
          data.teamIds
        )

        return {
          service,
          order: data.order,
          project: sanitizeProject({
            id: data.id,
            slug: data.slug,
            service,
            title: data.title,
            shortDescription: data.shortDescription,
            fullDescription: '',
            type: data.type as ServiceType,
            category: data.category as ProjectCategory,
            thumbnail: data.thumbnailPath,
            gallery: [],
            mediaKind: data.mediaKind,
            posterImage: data.posterPath,
            primaryTalentId,
            collaboratorTalentIds,
            clientName: data.clientName,
            clientLogo: data.clientLogo,
            date: data.date,
            featured: data.featured,
            tags: data.tags,
          }),
        } satisfies PortfolioSummaryRecord
      })
      .filter((entry): entry is PortfolioSummaryRecord => Boolean(entry))
      .sort(compareProjects)

    const detailsBySlug = detailDocs.docs.reduce<Record<string, PortfolioDetailRecord>>((collection, doc) => {
      const parsed = portfolioDetailSchema.safeParse(doc.data())
      if (!parsed.success) {
        return collection
      }

      const data = parsed.data
      const summary = summaries.find((entry) => entry.project.slug === data.slug)
      const service = resolvePortfolioService(data.service, summary?.project.type ?? 'photo')
      const primaryTalentId = resolvePrimaryTalentId(
        data.primaryTalentId,
        data.talentId,
        summary?.project.primaryTalentId ? [summary.project.primaryTalentId] : undefined,
        undefined
      )

      if (!service || !primaryTalentId) {
        return collection
      }

      collection[data.slug] = {
        slug: data.slug,
        service,
        primaryTalentId,
        fullDescription: normalizeText(data.fullDescription),
        heroImage: getFirebaseStoragePublicUrl(data.heroPath ?? summary?.project.thumbnail ?? ''),
        heroLightboxImage: normalizeStoragePath(data.heroLightboxPath),
        galleryImages: data.galleryPaths.map(getFirebaseStoragePublicUrl),
        galleryLightboxImages: data.galleryLightboxPaths?.map(getFirebaseStoragePublicUrl),
        mediaKind: data.mediaKind,
        posterImage: normalizeStoragePath(data.posterPath),
        hlsManifestPath: normalizeStoragePath(data.hlsManifestPath),
        youtubeVideoId: data.youtubeVideoId,
        youtubeStartSeconds: data.youtubeStartSeconds,
        videoEntries: normalizeVideoEntries(
          data.videoEntries as ProjectVideoEntry[] | undefined
        ),
        designSections: normalizeDesignSections(data.designSections as DesignSection[] | undefined),
        caseStudyCredit: data.caseStudyCredit ? normalizeText(data.caseStudyCredit) : undefined,
      }

      return collection
    }, {})

    if (summaries.length === 0 || talents.length === 0) {
      return null
    }

    return { talents, summaries, detailsBySlug }
  } catch (error) {
    console.warn('Falling back to local content seed data because Firebase content could not be loaded.', error)
    return null
  }
}

const getContentSnapshot = cache(async (): Promise<ContentSnapshot> => {
  const firebaseSnapshot = await loadFirebaseSnapshot()
  return firebaseSnapshot ?? createLocalFallbackSnapshot()
})

export const getAllTalents = cache(async () => {
  const snapshot = await getContentSnapshot()
  return snapshot.talents
})

export const getTalentBySlug = cache(async (slug: string) => {
  const talents = await getAllTalents()
  return talents.find((talent) => talent.slug === slug)
})

export const getAllProjects = cache(async () => {
  const snapshot = await getContentSnapshot()
  return snapshot.summaries.map((entry) => entry.project)
})

export const getProjectBySlug = cache(async (slug: string) => {
  const snapshot = await getContentSnapshot()
  const summary = snapshot.summaries.find((entry) => entry.project.slug === slug)
  if (!summary) return undefined

  const detail = snapshot.detailsBySlug[slug]
  return mergeProjectSummaryWithDetail(summary, detail)
})

export const getProjectsByTalent = cache(async (talentId: string) => {
  const projects = await getAllProjects()
  return projects.filter(
    (project) =>
      project.primaryTalentId === talentId || project.collaboratorTalentIds.includes(talentId)
  )
})

export async function getRelatedProjects(project: Project, count = 3) {
  const projects = await getAllProjects()
  return projects
    .filter(
      (candidate) =>
        candidate.id !== project.id &&
        (candidate.type === project.type || candidate.category === project.category)
    )
    .slice(0, count)
}

export const getTalentProjectPreviewMap = cache(async (limit = 3) => {
  const [talents, projects] = await Promise.all([getAllTalents(), getAllProjects()])

  return talents.reduce<Record<string, Project[]>>((collection, talent) => {
    collection[talent.id] = projects
      .filter(
        (project) =>
          project.primaryTalentId === talent.id ||
          project.collaboratorTalentIds.includes(talent.id)
      )
      .sort((left, right) => Number(right.featured) - Number(left.featured))
      .slice(0, limit)

    return collection
  }, {})
})

export const getTalentOverlayProjectMap = cache(async () => {
  const snapshot = await getContentSnapshot()

  return snapshot.talents.reduce<Record<string, Project[]>>((collection, talent) => {
    collection[talent.id] = snapshot.summaries
      .filter(
        (entry) =>
          !isServicePortfolioWipOnly(entry.service) &&
          (entry.project.primaryTalentId === talent.id ||
            entry.project.collaboratorTalentIds.includes(talent.id))
      )
      .map((entry) => mergeProjectSummaryWithDetail(entry, snapshot.detailsBySlug[entry.project.slug]))

    return collection
  }, {})
})

export const getServiceProjects = cache(async (serviceSlug: ServicePortfolioSlug) => {
  const snapshot = await getContentSnapshot()
  return snapshot.summaries
    .filter((entry) => entry.service === serviceSlug)
    .sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order
      }

      return compareProjects(left, right)
    })
    .map((entry) => entry.project)
})

type DesignTalentPortfolio = {
  talent: Talent
  projects: Project[]
}

export const getDesignPortfolioTalentEntries = cache(async (): Promise<DesignTalentPortfolio[]> => {
  const [talents, designProjects] = await Promise.all([getAllTalents(), getServiceProjects('design')])
  const talentById = new Map(talents.map((talent) => [talent.id, talent]))

  const groupedProjects = designProjects.reduce<Record<string, Project[]>>((collection, project) => {
    if (!project.primaryTalentId) {
      return collection
    }

    collection[project.primaryTalentId] = collection[project.primaryTalentId] ?? []
    collection[project.primaryTalentId].push(project)
    return collection
  }, {})

  return Object.entries(groupedProjects)
    .map(([talentId, projects]) => {
      const talent = talentById.get(talentId)
      if (!talent) {
        return null
      }

      return {
        talent,
        projects,
      }
    })
    .filter((entry): entry is DesignTalentPortfolio => Boolean(entry))
    .sort((left, right) => left.talent.order - right.talent.order)
})

export const getDesignTalentPortfolio = cache(
  async (talentSlug: string): Promise<DesignTalentPortfolio | null> => {
    const entries = await getDesignPortfolioTalentEntries()
    return entries.find((entry) => entry.talent.slug === talentSlug) ?? null
  }
)

export const getDesignPortfolioTalentSlugs = cache(async () => {
  const entries = await getDesignPortfolioTalentEntries()
  return entries.map((entry) => entry.talent.slug)
})

export const getDesignProjectSlugs = cache(async () => {
  const projects = await getServiceProjects('design')
  return projects.map((project) => project.slug)
})

export const getAllServiceProjectRoutes = cache(async () => {
  const snapshot = await getContentSnapshot()
  return snapshot.summaries
    .filter((entry) => !isServicePortfolioWipOnly(entry.service))
    .map((entry) => ({
      service: entry.service,
      slug: entry.project.slug,
    }))
})

export const getPortfolioCaseStudy = cache(
  async (serviceSlug: ServicePortfolioSlug, slug: string): Promise<PortfolioCaseStudy | null> => {
    if (!isServicePortfolioSlug(serviceSlug)) {
      return null
    }

    if (isServicePortfolioWipOnly(serviceSlug)) {
      return null
    }

    const [snapshot, talents] = await Promise.all([getContentSnapshot(), getAllTalents()])
    const summary = snapshot.summaries.find(
      (entry) => entry.service === serviceSlug && entry.project.slug === slug
    )

    if (!summary) {
      return null
    }

    const service = getServicePortfolioBySlug(serviceSlug)
    if (!service) {
      return null
    }

    const detail = snapshot.detailsBySlug[slug]
    const talent = talents.find((candidate) => candidate.id === summary.project.primaryTalentId) ?? null

    return {
      project: {
        ...summary.project,
        fullDescription: detail?.fullDescription ?? summary.project.fullDescription,
        heroImage: detail?.heroImage ?? summary.project.heroImage ?? summary.project.thumbnail,
        heroLightboxImage:
          detail?.heroLightboxImage ??
          summary.project.heroLightboxImage ??
          detail?.heroImage ??
          summary.project.heroImage ??
          summary.project.thumbnail,
        gallery: detail?.galleryImages ?? summary.project.gallery,
        galleryLightbox:
          detail?.galleryLightboxImages ?? summary.project.galleryLightbox ?? detail?.galleryImages ?? summary.project.gallery,
        mediaKind: detail?.mediaKind ?? summary.project.mediaKind,
        posterImage: detail?.posterImage ?? summary.project.posterImage,
        hlsManifestPath: detail?.hlsManifestPath ?? summary.project.hlsManifestPath,
        youtubeVideoId: detail?.youtubeVideoId ?? summary.project.youtubeVideoId,
        youtubeStartSeconds: detail?.youtubeStartSeconds ?? summary.project.youtubeStartSeconds,
        videoEntries: detail?.videoEntries ?? summary.project.videoEntries,
        designSections: detail?.designSections ?? summary.project.designSections,
        caseStudyCredit: detail?.caseStudyCredit ?? summary.project.caseStudyCredit,
      },
      talent,
      service,
      heroImage: detail?.heroImage ?? summary.project.heroImage ?? summary.project.thumbnail,
      heroLightboxImage:
        detail?.heroLightboxImage ??
        summary.project.heroLightboxImage ??
        detail?.heroImage ??
        summary.project.heroImage ??
        summary.project.thumbnail,
      galleryImages: detail?.galleryImages ?? summary.project.gallery,
      galleryLightboxImages:
        detail?.galleryLightboxImages ?? summary.project.galleryLightbox ?? detail?.galleryImages ?? summary.project.gallery,
      mediaKind: detail?.mediaKind ?? summary.project.mediaKind,
      posterImage: detail?.posterImage ?? summary.project.posterImage,
      hlsManifestPath: detail?.hlsManifestPath ?? summary.project.hlsManifestPath,
      youtubeVideoId: detail?.youtubeVideoId ?? summary.project.youtubeVideoId,
      youtubeStartSeconds: detail?.youtubeStartSeconds ?? summary.project.youtubeStartSeconds,
      videoEntries: detail?.videoEntries ?? summary.project.videoEntries,
      designSections: detail?.designSections ?? summary.project.designSections,
      caseStudyCredit: detail?.caseStudyCredit ?? summary.project.caseStudyCredit,
    }
  }
)

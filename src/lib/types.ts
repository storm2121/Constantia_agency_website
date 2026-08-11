export type ServiceType =
  | 'photo'
  | 'video'
  | 'design'
  | 'animation'
  | 'web'
  | 'strategy'

export type PortfolioServiceSlug =
  | 'photo'
  | 'video'
  | 'motion'
  | 'design'
  | 'web'

export type ProjectMediaKind =
  | 'image-gallery'
  | 'storage-video'
  | 'youtube-embed'

export type DesignSectionKind = 'images' | 'mixed' | 'videos'

export type ProjectCategory =
  | 'corporate'
  | 'events'
  | 'nature'
  | 'brand'
  | 'music'
  | 'social'
  | 'digital'
  | 'documentary'
  | 'advertising'

export interface ClientRef {
  name: string
  logo: string
  url?: string
}

export interface TalentSocialLinks {
  twitter?: string
  linkedin?: string
  instagram?: string
  behance?: string
}

export interface Talent {
  id: string
  slug: string
  name: string
  role: string
  shortBio: string
  fullBio: string
  skills: string[]
  clients: ClientRef[]
  image: string
  social?: TalentSocialLinks
  services: ServiceType[]
  order: number
}

export interface ProjectVideoEntry {
  id: string
  title: string
  posterPath: string
  hlsManifestPath: string
  order: number
}

export interface DesignSection {
  id: string
  title: string
  kind: DesignSectionKind
  previewPaths: string[]
  fullPaths: string[]
  videoEntries?: ProjectVideoEntry[]
}

export interface Project {
  id: string
  slug: string
  service: PortfolioServiceSlug
  title: string
  shortDescription: string
  fullDescription: string
  type: ServiceType
  category: ProjectCategory
  thumbnail: string
  gallery: string[]
  mediaKind: ProjectMediaKind
  heroImage?: string
  heroLightboxImage?: string
  posterImage?: string
  hlsManifestPath?: string
  youtubeVideoId?: string
  youtubeStartSeconds?: number
  galleryLightbox?: string[]
  videoEntries?: ProjectVideoEntry[]
  designSections?: DesignSection[]
  primaryTalentId: string
  collaboratorTalentIds: string[]
  caseStudyCredit?: string
  clientName: string
  clientLogo?: string
  date: string
  featured: boolean
  tags: string[]
}

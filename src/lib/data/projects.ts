import type { Project } from '../types'

function buildStorageGalleryPaths(
  service: string,
  slug: string,
  count: number,
  variant: 'preview' | 'full'
) {
  const prefix =
    variant === 'full'
      ? `portfolios/${service}/${slug}/gallery/full`
      : `portfolios/${service}/${slug}/gallery`

  return Array.from({ length: count }, (_, index) => {
    return `${prefix}/${String(index + 1).padStart(2, '0')}.webp`
  })
}

function buildMotionVideoEntries(slug: string, titles: string[]) {
  return titles.map((title, index) => {
    const videoId = `video-${String(index + 1).padStart(2, '0')}`

    return {
      id: videoId,
      title,
      posterPath: `portfolios/motion/${slug}/videos/${videoId}/poster.webp`,
      hlsManifestPath: `portfolios/motion/${slug}/videos/${videoId}/master.m3u8`,
      order: index,
    }
  })
}

function buildVideoEntries(slug: string, titles: string[]) {
  return titles.map((title, index) => {
    const videoId = `video-${String(index + 1).padStart(2, '0')}`

    return {
      id: videoId,
      title,
      posterPath: `portfolios/video/${slug}/videos/${videoId}/poster.webp`,
      hlsManifestPath: `portfolios/video/${slug}/videos/${videoId}/master.m3u8`,
      order: index,
    }
  })
}

function buildSingleVideoProject(config: {
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  category: Project['category']
  date: string
  featured: boolean
  tags: string[]
}) {
  return {
    id: config.slug,
    slug: config.slug,
    service: 'video',
    title: config.title,
    shortDescription: config.shortDescription,
    fullDescription: config.fullDescription,
    type: 'video',
    category: config.category,
    thumbnail: `portfolios/video/${config.slug}/thumb/thumb.webp`,
    gallery: buildStorageGalleryPaths('video', config.slug, 6, 'preview'),
    mediaKind: 'storage-video',
    heroImage: `portfolios/video/${config.slug}/poster/poster.webp`,
    posterImage: `portfolios/video/${config.slug}/poster/poster.webp`,
    hlsManifestPath: `portfolios/video/${config.slug}/video/master.m3u8`,
    galleryLightbox: buildStorageGalleryPaths('video', config.slug, 6, 'full'),
    primaryTalentId: 'youssef-azzouggarh',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Videographer / Director',
    clientName: '',
    date: config.date,
    featured: config.featured,
    tags: config.tags,
  } satisfies Project
}

function buildGroupedVideoProject(config: {
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  category: Project['category']
  date: string
  featured: boolean
  tags: string[]
  videoTitles: string[]
}) {
  return {
    id: config.slug,
    slug: config.slug,
    service: 'video',
    title: config.title,
    shortDescription: config.shortDescription,
    fullDescription: config.fullDescription,
    type: 'video',
    category: config.category,
    thumbnail: `portfolios/video/${config.slug}/thumb/thumb.webp`,
    gallery: [],
    mediaKind: 'storage-video',
    heroImage: `portfolios/video/${config.slug}/poster/poster.webp`,
    posterImage: `portfolios/video/${config.slug}/poster/poster.webp`,
    galleryLightbox: [],
    videoEntries: buildVideoEntries(config.slug, config.videoTitles),
    primaryTalentId: 'youssef-azzouggarh',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Videographer / Director',
    clientName: '',
    date: config.date,
    featured: config.featured,
    tags: config.tags,
  } satisfies Project
}

function buildDesignSectionPaths(
  talentId: string,
  collectionSlug: string,
  sectionId: string,
  count: number,
  variant: 'preview' | 'full'
) {
  const prefix = `portfolios/design/${talentId}/${collectionSlug}/sections/${sectionId}/${variant}`

  return Array.from({ length: count }, (_, index) => {
    return `${prefix}/${String(index + 1).padStart(2, '0')}.webp`
  })
}

function buildDesignVideoEntries(
  talentId: string,
  collectionSlug: string,
  sectionId: string,
  titles: string[]
) {
  return titles.map((title, index) => {
    const videoId = `video-${String(index + 1).padStart(2, '0')}`

    return {
      id: videoId,
      title,
      posterPath: `portfolios/design/${talentId}/${collectionSlug}/videos/${sectionId}/${videoId}/poster.webp`,
      hlsManifestPath: `portfolios/design/${talentId}/${collectionSlug}/videos/${sectionId}/${videoId}/master.m3u8`,
      order: index,
    }
  })
}

function buildDesignImageSection(
  talentId: string,
  collectionSlug: string,
  sectionId: string,
  title: string,
  count: number
) {
  return {
    id: sectionId,
    title,
    kind: 'images' as const,
    previewPaths: buildDesignSectionPaths(talentId, collectionSlug, sectionId, count, 'preview'),
    fullPaths: buildDesignSectionPaths(talentId, collectionSlug, sectionId, count, 'full'),
  }
}

function buildDesignMixedSection(
  talentId: string,
  collectionSlug: string,
  sectionId: string,
  title: string,
  videoTitles: string[]
) {
  const videoEntries = buildDesignVideoEntries(talentId, collectionSlug, sectionId, videoTitles)

  return {
    id: sectionId,
    title,
    kind: 'mixed' as const,
    previewPaths: buildDesignSectionPaths(talentId, collectionSlug, sectionId, videoTitles.length, 'preview'),
    fullPaths: buildDesignSectionPaths(talentId, collectionSlug, sectionId, videoTitles.length, 'full'),
    videoEntries,
  }
}

const VIDEO_PROJECTS: Project[] = [
  buildGroupedVideoProject({
    slug: 'advertising-video-collection',
    title: 'Advertising Video Collection',
    shortDescription:
      'A grouped campaign collection spanning compact ad cuts, product-led edits, and sharper commercial pacing.',
    fullDescription:
      'Advertising Video Collection brings together a set of short commercial cuts built for direct visual impact. The project is presented as one grouped case study because the pieces work as a campaign lane rather than standalone flagship films, showing how product framing, timing, and finish shift across multiple ad formats while staying under one authored video approach.',
    category: 'advertising',
    date: '2025',
    featured: true,
    tags: ['advertising', 'commercial video', 'campaign cuts', 'brand content'],
    videoTitles: [
      'Ad Cut 1',
      'Ad Cut 2',
      'Ad Cut 3',
      'Dofaa Final Video',
      'Estheplus',
      'Speed Ramping Baymoh Final',
    ],
  }),
  buildSingleVideoProject({
    slug: 'tourism-tv-show-trailer',
    title: 'Tourism TV Show Trailer',
    shortDescription:
      'A destination-led trailer cut built around travel atmosphere, forward motion, and broadcast-style pacing.',
    fullDescription:
      'Tourism TV Show Trailer is a travel-facing promo built to compress landscape, movement, and anticipation into a concise teaser format. The film leans on clear momentum, location contrast, and selective reveal, giving the piece the feel of a broadcast trailer rather than a loose tourism montage.',
    category: 'documentary',
    date: '2023',
    featured: true,
    tags: ['tourism', 'travel trailer', 'broadcast promo', 'destination film'],
  }),
  buildSingleVideoProject({
    slug: 'private-mountain-retreat-villa',
    title: 'Private Mountain Retreat Villa',
    shortDescription:
      'A cinematic hospitality film capturing privacy, scale, and the atmosphere of a high-end mountain retreat.',
    fullDescription:
      'Private Mountain Retreat Villa focuses on how a hospitality property is felt before it is explained. The piece moves between scale, architecture, and quiet detail, using aerial coverage and measured interior rhythm to make the location feel secluded, premium, and fully intentional.',
    category: 'advertising',
    date: '2025',
    featured: true,
    tags: ['hospitality', 'villa film', 'drone coverage', 'luxury property'],
  }),
  buildSingleVideoProject({
    slug: 'tamadot-video',
    title: 'Tamadot Video',
    shortDescription:
      'A hospitality-led cut centered on mood, architecture, and the pace of a high-end guest experience.',
    fullDescription:
      'Tamadot Video is built around ambience and controlled visual pacing rather than hard sell messaging. The edit emphasizes material detail, spatial flow, and a calmer cinematic rhythm, making the property feel immersive and considered from the first frame onward.',
    category: 'advertising',
    date: '2024',
    featured: true,
    tags: ['hospitality', 'resort film', 'luxury travel', 'cinematic edit'],
  }),
  buildSingleVideoProject({
    slug: 'private-villa-drone-and-interior-coverage',
    title: 'Private Villa Drone and Interior Coverage',
    shortDescription:
      'A property-focused film balancing aerial scope with interior detail and clean commercial movement.',
    fullDescription:
      'Private Villa Drone and Interior Coverage is a location film built to move smoothly between broad aerial context and more intimate interior framing. The project highlights how drone footage and grounded camera movement can work together to present a property with clarity and premium control.',
    category: 'advertising',
    date: '2025',
    featured: false,
    tags: ['property film', 'drone video', 'interior coverage', 'commercial video'],
  }),
  buildSingleVideoProject({
    slug: 'luxury-jacuzzi-suite-video',
    title: 'Luxury Jacuzzi Suite Video',
    shortDescription:
      'A short hospitality piece focused on suite detail, texture, and a restrained sense of luxury.',
    fullDescription:
      'Luxury Jacuzzi Suite Video narrows in on the premium details that define a hospitality stay: texture, lighting, material, and the pace at which those details are revealed. The edit stays compact and controlled, presenting the suite with clarity rather than excess.',
    category: 'advertising',
    date: '2025',
    featured: false,
    tags: ['suite showcase', 'hospitality video', 'luxury interior', 'property marketing'],
  }),
  buildSingleVideoProject({
    slug: 'magical-gala-evening',
    title: 'Magical Gala Evening',
    shortDescription:
      'An event film shaped around evening ambience, guest energy, and a polished gala atmosphere.',
    fullDescription:
      'Magical Gala Evening captures a live event through atmosphere first: lighting, movement, and the social tempo of the night. The cut keeps the sense of occasion intact while maintaining a clean editorial rhythm, giving the evening a more cinematic finish than standard coverage.',
    category: 'events',
    date: '2024',
    featured: false,
    tags: ['event film', 'gala coverage', 'live atmosphere', 'cinematic edit'],
  }),
  buildSingleVideoProject({
    slug: 'ahwach-folklore-video',
    title: 'Ahwach Folklore Video',
    shortDescription:
      'A cultural performance film built around rhythm, costume, and the collective force of live folklore.',
    fullDescription:
      'Ahwach Folklore Video documents a performance setting with attention to cadence, costume, and crowd rhythm. Rather than flattening the event into generic coverage, the edit keeps its cultural texture visible, letting the movement and staging carry the film forward.',
    category: 'events',
    date: '2024',
    featured: false,
    tags: ['folklore', 'performance film', 'culture', 'event coverage'],
  }),
  buildSingleVideoProject({
    slug: 'the-redrock-final-project',
    title: 'The Redrock Final Project',
    shortDescription:
      'A polished commercial cut focused on atmosphere, location presence, and confident visual pacing.',
    fullDescription:
      'The Redrock Final Project is a final-form branded film shaped around location character and a steady cinematic tempo. The edit prioritizes mood, transitions, and a clean sense of progression, giving the project a premium finish without overloading the frame.',
    category: 'advertising',
    date: '2025',
    featured: false,
    tags: ['brand film', 'location shoot', 'commercial edit', 'cinematic pacing'],
  }),
  buildSingleVideoProject({
    slug: 'kabana-final-video',
    title: 'Kabana Final Video',
    shortDescription:
      'A venue-led film built around movement, tone, and a sharper commercial presentation of place.',
    fullDescription:
      'Kabana Final Video turns a location-driven shoot into a concise branded cut with a stronger sense of mood and momentum. The film balances spatial reveal with editorial control, presenting the venue as an experience rather than a simple walkthrough.',
    category: 'brand',
    date: '2025',
    featured: false,
    tags: ['venue film', 'brand video', 'commercial edit', 'location showcase'],
  }),
]

export const projects: Project[] = [
  {
    id: 'epias-younes',
    slug: 'epias-younes',
    service: 'photo',
    title: "BEYOUND THE SEA, Espias Malignos & Into the Evernight - L'ma3adine",
    shortDescription:
      'A photography series exploring atmosphere, movement, and light through a live visual sequence.',
    fullDescription:
      'A photography series built around atmosphere, gesture, and the changing intensity of live presence. The work focuses on visual rhythm and stillness rather than narrative exposition, using composition and light to hold each frame with clarity.',
    type: 'photo',
    category: 'events',
    thumbnail: 'portfolios/photo/epias-younes/thumb/thumb.webp',
    gallery: buildStorageGalleryPaths('photo', 'epias-younes', 21, 'preview'),
    mediaKind: 'image-gallery',
    heroImage: 'portfolios/photo/epias-younes/hero/hero.webp',
    heroLightboxImage: 'portfolios/photo/epias-younes/hero/full.webp',
    galleryLightbox: buildStorageGalleryPaths('photo', 'epias-younes', 21, 'full'),
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Photographer',
    clientName: '',
    date: '2024',
    featured: true,
    tags: ['performance', 'atmosphere', 'live', 'photography'],
  },
  {
    id: 'perf-younes',
    slug: 'perf-younes',
    service: 'photo',
    title: 'Jubantouja - French Institute of Agadir',
    shortDescription:
      'A performance photography series observing rhythm, gesture, and stage presence through still frames.',
    fullDescription:
      'This photography series documents a live performance environment with an emphasis on timing, posture, and collective energy. Each image is treated as a self-contained composition, balancing documentary immediacy with a measured editorial sensibility.',
    type: 'photo',
    category: 'events',
    thumbnail: 'portfolios/photo/perf-younes/thumb/thumb.webp',
    gallery: buildStorageGalleryPaths('photo', 'perf-younes', 32, 'preview'),
    mediaKind: 'image-gallery',
    heroImage: 'portfolios/photo/perf-younes/hero/hero.webp',
    heroLightboxImage: 'portfolios/photo/perf-younes/hero/full.webp',
    galleryLightbox: buildStorageGalleryPaths('photo', 'perf-younes', 32, 'full'),
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Photographer',
    clientName: '',
    date: '2024',
    featured: false,
    tags: ['performance', 'stage', 'culture', 'photography'],
  },
  {
    id: 'street-younes',
    slug: 'street-younes',
    service: 'photo',
    title: 'Street Photography',
    shortDescription:
      'A street photography series focused on fleeting moments, contrast, and urban texture.',
    fullDescription:
      'A street photography study centered on timing, human movement, and the visual texture of public space. The images are built from observation rather than staging, capturing brief alignments of light, architecture, and everyday presence.',
    type: 'photo',
    category: 'documentary',
    thumbnail: 'portfolios/photo/street-younes/thumb/thumb.webp',
    gallery: buildStorageGalleryPaths('photo', 'street-younes', 48, 'preview'),
    mediaKind: 'image-gallery',
    heroImage: 'portfolios/photo/street-younes/hero/hero.webp',
    heroLightboxImage: 'portfolios/photo/street-younes/hero/full.webp',
    galleryLightbox: buildStorageGalleryPaths('photo', 'street-younes', 48, 'full'),
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Photographer',
    clientName: '',
    date: '2024',
    featured: false,
    tags: ['street', 'urban', 'documentary', 'photography'],
  },
  ...VIDEO_PROJECTS,
  {
    id: 'themgoodolddays-playlist-cover-system',
    slug: 'themgoodolddays-playlist-cover-system',
    service: 'design',
    title: 'ThemGoodOldDays Playlist Cover System',
    shortDescription:
      'A cover system built around nostalgic music artwork, mockups, and a disciplined retro palette.',
    fullDescription:
      'ThemGoodOldDays Playlist Cover System gathers a sequence of cover explorations and mockups shaped around nostalgia, tone, and repetition. The collection focuses on how a small image system can hold together across playlist environments while still letting each cover breathe as its own artifact.',
    type: 'design',
    category: 'music',
    thumbnail: 'portfolios/design/ayoub-ahnay/themgoodolddays-playlist-cover-system/thumb/thumb.webp',
    gallery: buildDesignSectionPaths(
      'ayoub-ahnay',
      'themgoodolddays-playlist-cover-system',
      'playlist-covers',
      5,
      'preview'
    ),
    mediaKind: 'image-gallery',
    heroImage: 'portfolios/design/ayoub-ahnay/themgoodolddays-playlist-cover-system/hero/hero.webp',
    heroLightboxImage:
      'portfolios/design/ayoub-ahnay/themgoodolddays-playlist-cover-system/hero/full.webp',
    galleryLightbox: buildDesignSectionPaths(
      'ayoub-ahnay',
      'themgoodolddays-playlist-cover-system',
      'playlist-covers',
      5,
      'full'
    ),
    designSections: [
      buildDesignImageSection(
        'ayoub-ahnay',
        'themgoodolddays-playlist-cover-system',
        'playlist-covers',
        'Playlist Cover Sequence',
        5
      ),
    ],
    primaryTalentId: 'ayoub-ahnay',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Cover Art / Graphic Design',
    clientName: '',
    date: '2024',
    featured: true,
    tags: ['album cover', 'playlist artwork', 'music design', 'visual system'],
  },
  {
    id: 'logo-marks-selection',
    slug: 'logo-marks-selection',
    service: 'design',
    title: 'Logo Marks Selection',
    shortDescription:
      'A compact selection of logo explorations balancing mark clarity, geometry, and brand presence.',
    fullDescription:
      'Logo Marks Selection combines two logo development studies that each approach identity from a slightly different angle. One leans on structured reduction, the other on softer spatial balance, but both show a careful interest in how a mark has to survive across applications and scale.',
    type: 'design',
    category: 'brand',
    thumbnail: 'portfolios/design/ayoub-ahnay/logo-marks-selection/thumb/thumb.webp',
    gallery: [
      ...buildDesignSectionPaths('ayoub-ahnay', 'logo-marks-selection', 'alburaq-hsr', 3, 'preview'),
      ...buildDesignSectionPaths('ayoub-ahnay', 'logo-marks-selection', 'gloryna-space', 4, 'preview'),
    ],
    mediaKind: 'image-gallery',
    heroImage: 'portfolios/design/ayoub-ahnay/logo-marks-selection/hero/hero.webp',
    heroLightboxImage: 'portfolios/design/ayoub-ahnay/logo-marks-selection/hero/full.webp',
    galleryLightbox: [
      ...buildDesignSectionPaths('ayoub-ahnay', 'logo-marks-selection', 'alburaq-hsr', 3, 'full'),
      ...buildDesignSectionPaths('ayoub-ahnay', 'logo-marks-selection', 'gloryna-space', 4, 'full'),
    ],
    designSections: [
      buildDesignImageSection('ayoub-ahnay', 'logo-marks-selection', 'alburaq-hsr', 'Alburaq HSR', 3),
      buildDesignImageSection('ayoub-ahnay', 'logo-marks-selection', 'gloryna-space', 'Gloryna Space', 4),
    ],
    primaryTalentId: 'ayoub-ahnay',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Identity Design / Logo Development',
    clientName: '',
    date: '2024',
    featured: false,
    tags: ['logo design', 'identity marks', 'brand system', 'symbol design'],
  },
  {
    id: 'poster-studies',
    slug: 'poster-studies',
    service: 'design',
    title: 'Poster Studies',
    shortDescription:
      'Poster experiments centered on layout tension, typography, and visual atmosphere.',
    fullDescription:
      'Poster Studies is a short but focused set of poster explorations where composition carries most of the weight. The work emphasizes hierarchy, typographic placement, and the relationship between a dominant visual and the negative space around it.',
    type: 'design',
    category: 'advertising',
    thumbnail: 'portfolios/design/ayoub-ahnay/poster-studies/thumb/thumb.webp',
    gallery: buildDesignSectionPaths('ayoub-ahnay', 'poster-studies', 'poster-series', 2, 'preview'),
    mediaKind: 'image-gallery',
    heroImage: 'portfolios/design/ayoub-ahnay/poster-studies/hero/hero.webp',
    heroLightboxImage: 'portfolios/design/ayoub-ahnay/poster-studies/hero/full.webp',
    galleryLightbox: buildDesignSectionPaths('ayoub-ahnay', 'poster-studies', 'poster-series', 2, 'full'),
    designSections: [
      buildDesignImageSection('ayoub-ahnay', 'poster-studies', 'poster-series', 'Poster Sequence', 2),
    ],
    primaryTalentId: 'ayoub-ahnay',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Poster Design / Art Direction',
    clientName: '',
    date: '2024',
    featured: false,
    tags: ['poster design', 'typography', 'layout', 'visual studies'],
  },
  {
    id: 'social-content-systems',
    slug: 'social-content-systems',
    service: 'design',
    title: 'Social Content Systems',
    shortDescription:
      'A multi-client social design system spanning recommendation posts, cultural content, and niche brand visuals.',
    fullDescription:
      'Social Content Systems brings together multiple social-first visual systems built for different tones and audiences. The collection shows how layout, pacing, and recurring frame logic adapt across recommendation content, brand communication, and smaller editorial-style feeds without collapsing into the same template.',
    type: 'design',
    category: 'social',
    thumbnail: 'portfolios/design/ayoub-ahnay/social-content-systems/thumb/thumb.webp',
    gallery: buildDesignSectionPaths('ayoub-ahnay', 'social-content-systems', 'books', 7, 'preview'),
    mediaKind: 'image-gallery',
    heroImage: 'portfolios/design/ayoub-ahnay/social-content-systems/hero/hero.webp',
    heroLightboxImage: 'portfolios/design/ayoub-ahnay/social-content-systems/hero/full.webp',
    galleryLightbox: buildDesignSectionPaths('ayoub-ahnay', 'social-content-systems', 'books', 7, 'full'),
    designSections: [
      buildDesignImageSection('ayoub-ahnay', 'social-content-systems', 'books', 'Books', 7),
      buildDesignImageSection('ayoub-ahnay', 'social-content-systems', 'channels', 'Channels', 7),
      buildDesignImageSection('ayoub-ahnay', 'social-content-systems', 'documentaries', 'Documentaries', 7),
      buildDesignImageSection('ayoub-ahnay', 'social-content-systems', 'movies', 'Movies', 7),
      buildDesignImageSection('ayoub-ahnay', 'social-content-systems', 'podcasts', 'Podcasts', 7),
      buildDesignImageSection('ayoub-ahnay', 'social-content-systems', 'series', 'Series', 7),
      buildDesignImageSection('ayoub-ahnay', 'social-content-systems', 'redone', 'Redone', 5),
      buildDesignImageSection(
        'ayoub-ahnay',
        'social-content-systems',
        'alassala-almaghribia',
        'Alassala Almaghribia',
        1
      ),
      buildDesignImageSection(
        'ayoub-ahnay',
        'social-content-systems',
        'the-chess-nerd',
        'The Chess Nerd',
        1
      ),
    ],
    primaryTalentId: 'ayoub-ahnay',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Social Media Design / Visual Systems',
    clientName: '',
    date: '2024',
    featured: true,
    tags: ['social design', 'content systems', 'campaign design', 'editorial posts'],
  },
  {
    id: 'web-landing-concept',
    slug: 'web-landing-concept',
    service: 'design',
    title: 'Web Landing Concept',
    shortDescription:
      'A web landing concept presented as a single focused interface study rather than a full product system.',
    fullDescription:
      'Web Landing Concept is a concentrated interface study built around one landing view. The case study is intentionally narrow: instead of a complete product, it focuses on one strong surface and how brand, hierarchy, and image treatment can hold a page together with minimal supporting material.',
    type: 'design',
    category: 'digital',
    thumbnail: 'portfolios/design/ayoub-ahnay/web-landing-concept/thumb/thumb.webp',
    gallery: buildDesignSectionPaths('ayoub-ahnay', 'web-landing-concept', 'landing-page', 1, 'preview'),
    mediaKind: 'image-gallery',
    heroImage: 'portfolios/design/ayoub-ahnay/web-landing-concept/hero/hero.webp',
    heroLightboxImage: 'portfolios/design/ayoub-ahnay/web-landing-concept/hero/full.webp',
    galleryLightbox: buildDesignSectionPaths('ayoub-ahnay', 'web-landing-concept', 'landing-page', 1, 'full'),
    designSections: [
      buildDesignImageSection('ayoub-ahnay', 'web-landing-concept', 'landing-page', 'Landing Page Study', 1),
    ],
    primaryTalentId: 'ayoub-ahnay',
    collaboratorTalentIds: [],
    caseStudyCredit: 'UI Concept / Graphic Design',
    clientName: '',
    date: '2024',
    featured: false,
    tags: ['web design', 'landing page', 'interface concept', 'visual layout'],
  },
  {
    id: 'regisol-educational-carousels',
    slug: 'regisol-educational-carousels',
    service: 'design',
    title: 'Regisol Educational Carousels',
    shortDescription:
      'A sectioned carousel system for Regisol that turns technical and brand information into readable social sequences.',
    fullDescription:
      'Regisol Educational Carousels collects a set of social carousels designed to make technical or institutional information feel easy to scan. The work is grounded in consistency and clarity, using repeated layout logic to turn separate educational topics into one coherent visual language.',
    type: 'design',
    category: 'digital',
    thumbnail: 'portfolios/design/younes-arbani/regisol-educational-carousels/thumb/thumb.webp',
    gallery: buildDesignSectionPaths(
      'younes-arbani',
      'regisol-educational-carousels',
      'welcome-regisol',
      6,
      'preview'
    ),
    mediaKind: 'image-gallery',
    heroImage: 'portfolios/design/younes-arbani/regisol-educational-carousels/hero/hero.webp',
    heroLightboxImage:
      'portfolios/design/younes-arbani/regisol-educational-carousels/hero/full.webp',
    galleryLightbox: buildDesignSectionPaths(
      'younes-arbani',
      'regisol-educational-carousels',
      'welcome-regisol',
      6,
      'full'
    ),
    designSections: [
      buildDesignImageSection(
        'younes-arbani',
        'regisol-educational-carousels',
        'welcome-regisol',
        'Bienvenue chez Regisol',
        6
      ),
      buildDesignImageSection(
        'younes-arbani',
        'regisol-educational-carousels',
        'energy-morocco',
        'Why Energy Matters in Morocco',
        6
      ),
      buildDesignImageSection(
        'younes-arbani',
        'regisol-educational-carousels',
        'website-carousel',
        'Regisol Website Carousel',
        6
      ),
    ],
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Carousel Design / Brand Communication',
    clientName: 'Regisol',
    clientLogo: '/images/clients/regisol.svg',
    date: '2024',
    featured: true,
    tags: ['carousel design', 'educational content', 'social graphics', 'energy sector'],
  },
  {
    id: 'regisol-campaign-assets',
    slug: 'regisol-campaign-assets',
    service: 'design',
    title: 'Regisol Campaign Assets',
    shortDescription:
      'Campaign-ready design assets for Regisol across banners, product visuals, profile imagery, and installation highlights.',
    fullDescription:
      'Regisol Campaign Assets gathers the brand-facing and promotional pieces built around Regisol’s public communication. It covers banner work, product visuals, profile assets, and location-based campaign posts, showing a more campaign-oriented side of the same visual system.',
    type: 'design',
    category: 'brand',
    thumbnail: 'portfolios/design/younes-arbani/regisol-campaign-assets/thumb/thumb.webp',
    gallery: buildDesignSectionPaths('younes-arbani', 'regisol-campaign-assets', 'banners', 2, 'preview'),
    mediaKind: 'image-gallery',
    heroImage: 'portfolios/design/younes-arbani/regisol-campaign-assets/hero/hero.webp',
    heroLightboxImage: 'portfolios/design/younes-arbani/regisol-campaign-assets/hero/full.webp',
    galleryLightbox: buildDesignSectionPaths('younes-arbani', 'regisol-campaign-assets', 'banners', 2, 'full'),
    designSections: [
      buildDesignImageSection(
        'younes-arbani',
        'regisol-campaign-assets',
        'banners',
        'Facebook & LinkedIn Banner',
        2
      ),
      buildDesignImageSection(
        'younes-arbani',
        'regisol-campaign-assets',
        'product-series-1',
        'Product Series I',
        4
      ),
      buildDesignImageSection(
        'younes-arbani',
        'regisol-campaign-assets',
        'product-series-2',
        'Product Series II',
        4
      ),
      buildDesignImageSection(
        'younes-arbani',
        'regisol-campaign-assets',
        'product-series-3',
        'Product Series III',
        4
      ),
      buildDesignImageSection(
        'younes-arbani',
        'regisol-campaign-assets',
        'rabat-installation',
        'Rabat Installation Photovoltaïque',
        4
      ),
      buildDesignImageSection(
        'younes-arbani',
        'regisol-campaign-assets',
        'profile-picture',
        'Profile Picture',
        2
      ),
    ],
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Campaign Design / Visual Assets',
    clientName: 'Regisol',
    clientLogo: '/images/clients/regisol.svg',
    date: '2024',
    featured: false,
    tags: ['campaign assets', 'banner design', 'product visuals', 'brand communication'],
  },
  {
    id: 'regisol-social-reels',
    slug: 'regisol-social-reels',
    service: 'design',
    title: 'Regisol Social Reels',
    shortDescription:
      'Short-form Regisol reels paired with strong cover imagery so the design language remains clear before playback begins.',
    fullDescription:
      'Regisol Social Reels brings together motion-backed design outputs used in Regisol’s social communication. The collection stays image-first at the page level, but each reel remains fully playable on demand, preserving the balance between graphic composition and lightweight delivery.',
    type: 'design',
    category: 'social',
    thumbnail: 'portfolios/design/younes-arbani/regisol-social-reels/thumb/thumb.webp',
    gallery: [
      ...buildDesignSectionPaths('younes-arbani', 'regisol-social-reels', 'global-wind-day', 1, 'preview'),
      ...buildDesignSectionPaths('younes-arbani', 'regisol-social-reels', 'photovoltaiques-reel', 2, 'preview'),
    ],
    mediaKind: 'image-gallery',
    heroImage: 'portfolios/design/younes-arbani/regisol-social-reels/hero/hero.webp',
    heroLightboxImage: 'portfolios/design/younes-arbani/regisol-social-reels/hero/full.webp',
    galleryLightbox: [
      ...buildDesignSectionPaths('younes-arbani', 'regisol-social-reels', 'global-wind-day', 1, 'full'),
      ...buildDesignSectionPaths('younes-arbani', 'regisol-social-reels', 'photovoltaiques-reel', 2, 'full'),
    ],
    designSections: [
      buildDesignMixedSection(
        'younes-arbani',
        'regisol-social-reels',
        'global-wind-day',
        'Global Wind Day',
        ['Global Wind Day Reel']
      ),
      buildDesignMixedSection(
        'younes-arbani',
        'regisol-social-reels',
        'photovoltaiques-reel',
        'Photovoltaïques Reels',
        ['Photovoltaïques Reel - Facebook', 'Photovoltaïques Reel - Instagram']
      ),
    ],
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Social Reels / Design Direction',
    clientName: 'Regisol',
    clientLogo: '/images/clients/regisol.svg',
    date: '2024',
    featured: false,
    tags: ['social reels', 'motion-supported design', 'campaign video', 'energy branding'],
  },
  {
    id: 'personal-brands-motion-series',
    slug: 'personal-brands-motion-series',
    service: 'motion',
    title: 'Personal Brands Motion Series',
    shortDescription:
      'A curated motion series built for personal brands through polished reels, speaking presence, and high-control edit rhythm.',
    fullDescription:
      'Personal Brands Motion Series gathers a set of motion-led social edits built around personality, polish, and direct audience communication. The work emphasizes presence, pacing, and visual control across short-form reels, turning personality-driven footage into sharper, more cinematic brand communication.',
    type: 'animation',
    category: 'brand',
    thumbnail: 'portfolios/motion/personal-brands-motion-series/thumb/thumb.webp',
    gallery: [],
    mediaKind: 'storage-video',
    heroImage: 'portfolios/motion/personal-brands-motion-series/poster/poster.webp',
    posterImage: 'portfolios/motion/personal-brands-motion-series/poster/poster.webp',
    hlsManifestPath: 'portfolios/motion/personal-brands-motion-series/videos/video-01/master.m3u8',
    galleryLightbox: [],
    videoEntries: buildMotionVideoEntries('personal-brands-motion-series', [
      '17 Mar Reel',
      'March Personal Reel',
      'Baymoh Personal Brand Reel',
      'Broadcast Test Reel',
      'Behind the Scenes Reel',
      'Blépharoplastie Reel',
    ]),
    primaryTalentId: 'youssef-azzouggarh',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Motion Designer / Editor',
    clientName: '',
    date: '2025',
    featured: true,
    tags: ['motion graphics', 'personal branding', 'social reels', 'brand storytelling'],
  },
  {
    id: 'sports-motion-series',
    slug: 'sports-motion-series',
    service: 'motion',
    title: 'Sports Motion Series',
    shortDescription:
      'A fast-cut motion collection shaped around sports energy, highlight pacing, and social-first competitive edits.',
    fullDescription:
      'Sports Motion Series brings together a set of high-energy sports edits designed for impact, momentum, and immediate visual clarity. The project focuses on timing, kinetic rhythm, and sharp visual emphasis, turning sports footage into compact reels that feel urgent, controlled, and built for fast audience attention.',
    type: 'animation',
    category: 'social',
    thumbnail: 'portfolios/motion/sports-motion-series/videos/video-05/poster.webp',
    gallery: [],
    mediaKind: 'storage-video',
    heroImage: 'portfolios/motion/sports-motion-series/poster/poster.webp',
    posterImage: 'portfolios/motion/sports-motion-series/poster/poster.webp',
    hlsManifestPath: 'portfolios/motion/sports-motion-series/videos/video-01/master.m3u8',
    galleryLightbox: [],
    videoEntries: buildMotionVideoEntries('sports-motion-series', [
      'Rgragui Sports Edit',
      'Sports Highlight 1',
      'Sports Highlight 2',
      'Sports Highlight 3',
      'Sports Highlight 4',
      'Sports Highlight 7',
    ]),
    primaryTalentId: 'youssef-azzouggarh',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Motion Designer / Editor',
    clientName: '',
    date: '2025',
    featured: false,
    tags: ['motion graphics', 'sports content', 'social reels', 'high-energy edits'],
  },
  {
    id: 'aui-explainers-gitex',
    slug: 'aui-explainers-gitex',
    service: 'motion',
    title: 'AUI Explainers & GITEX Motion Series',
    shortDescription:
      'Motion-led communication pieces for AUI across academic explainers and event-facing digital promotion.',
    fullDescription:
      'AUI Explainers & GITEX Motion Series brings together academic explainer outputs and event-facing digital promotion into one motion-led case study. The work focuses on clarity, pacing, and institutional storytelling, using titles, transitions, and disciplined sequencing to make information feel concise, legible, and visually current across multiple campaign surfaces.',
    type: 'animation',
    category: 'digital',
    thumbnail: 'portfolios/motion/aui-explainers-gitex/thumb/thumb.webp',
    gallery: [],
    mediaKind: 'storage-video',
    heroImage: 'portfolios/motion/aui-explainers-gitex/poster/poster.webp',
    posterImage: 'portfolios/motion/aui-explainers-gitex/poster/poster.webp',
    hlsManifestPath: 'portfolios/motion/aui-explainers-gitex/videos/video-01/master.m3u8',
    galleryLightbox: [],
    videoEntries: buildMotionVideoEntries('aui-explainers-gitex', [
      'AUI Exchange Explainer 1',
      'AUI Exchange Explainer 2',
      'AUI Exchange Explainer 3',
      "AUI Master's Explainer 1",
      "AUI Master's Explainer 2",
      'AUI GITEX Alumni Invitation',
    ]),
    primaryTalentId: 'ayoub-ahnay',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Motion Designer / Editor',
    clientName: 'Al Akhawayn University',
    clientLogo: '/images/clients/al-akhawayn.svg',
    date: '2024',
    featured: true,
    tags: ['motion graphics', 'explainer', 'event promotion', 'education'],
  },
  {
    id: 'aui-open-day-womens-day',
    slug: 'aui-open-day-womens-day',
    service: 'motion',
    title: "AUI Open Day & Women's Day Motion",
    shortDescription:
      'Motion pieces built for AUI event communication across campus-facing announcements and themed campaigns.',
    fullDescription:
      "AUI Open Day & Women's Day Motion combines two event-focused motion pieces built to announce, frame, and energize campus communication. The project emphasizes event identity, short-form pacing, and clean title systems, showing how restrained motion can sharpen promotional messaging without sacrificing atmosphere.",
    type: 'animation',
    category: 'events',
    thumbnail: 'portfolios/motion/aui-open-day-womens-day/thumb/thumb.webp',
    gallery: [],
    mediaKind: 'storage-video',
    heroImage: 'portfolios/motion/aui-open-day-womens-day/poster/poster.webp',
    posterImage: 'portfolios/motion/aui-open-day-womens-day/poster/poster.webp',
    hlsManifestPath: 'portfolios/motion/aui-open-day-womens-day/videos/video-01/master.m3u8',
    galleryLightbox: [],
    videoEntries: buildMotionVideoEntries('aui-open-day-womens-day', [
      'AUI Open Day',
      "AUI Women's Day",
    ]),
    primaryTalentId: 'ayoub-ahnay',
    collaboratorTalentIds: [],
    caseStudyCredit: 'Motion Designer / Editor',
    clientName: 'Al Akhawayn University',
    clientLogo: '/images/clients/al-akhawayn.svg',
    date: '2024',
    featured: false,
    tags: ['motion graphics', 'event campaign', 'campus', 'announcement'],
  },
  {
    id: 'ken-platform',
    slug: 'ken-platform',
    service: 'web',
    title: 'Ken - Opportunities & Courses Platform',
    shortDescription:
      'A scalable platform for sharing opportunities, paid courses, and booking sessions with professionals.',
    fullDescription:
      'Ken is a scalable, full-featured platform for sharing opportunities and paid courses, and booking sessions with professionals, built to empower youth and professionals alike. Built with a focus on performance, clean architecture, and intuitive UX, Ken handles complex user flows with elegance.',
    type: 'web',
    category: 'digital',
    thumbnail: '/images/portfolio/project-01-photography.jpg',
    gallery: ['/images/portfolio/project-01-photography.jpg'],
    mediaKind: 'image-gallery',
    primaryTalentId: 'achraf-el-ghazi',
    collaboratorTalentIds: [],
    clientName: 'Al Akhawayn University',
    clientLogo: '/images/clients/al-akhawayn.svg',
    date: '2024',
    featured: true,
    tags: ['web app', 'platform', 'education', 'booking'],
  },
  {
    id: 'reslab-booking-system',
    slug: 'reslab-booking-system',
    service: 'web',
    title: 'Reslab - Laboratory Booking System',
    shortDescription: 'A robust booking and research sharing system for AUI laboratories.',
    fullDescription:
      'Reslab is a robust booking and research sharing system tailored for AUI laboratories, facilitating lab access, research tracking, and institutional visibility. Complex scheduling logic made simple. Clean interfaces backed by solid architecture.',
    type: 'web',
    category: 'corporate',
    thumbnail: '/images/portfolio/project-02-videography.jpg',
    gallery: ['/images/portfolio/project-02-videography.jpg'],
    mediaKind: 'image-gallery',
    primaryTalentId: 'achraf-el-ghazi',
    collaboratorTalentIds: [],
    clientName: 'Al Akhawayn University',
    clientLogo: '/images/clients/al-akhawayn.svg',
    date: '2024',
    featured: false,
    tags: ['web app', 'booking', 'research', 'university'],
  },
  {
    id: 'charikaty',
    slug: 'charikaty',
    service: 'web',
    title: 'Charikaty - Company Creation Platform',
    shortDescription:
      'Create and manage your company online with full legal, accounting, and administrative support.',
    fullDescription:
      'Charikaty allows you to create and manage your company online, with a simple process and full legal, accounting, and administrative support. An end-to-end platform that removes friction from the company formation process, designed for the Moroccan market with local compliance built in.',
    type: 'web',
    category: 'digital',
    thumbnail: '/images/portfolio/project-03-event.jpg',
    gallery: ['/images/portfolio/project-03-event.jpg'],
    mediaKind: 'image-gallery',
    primaryTalentId: 'mohamed-el-hansali',
    collaboratorTalentIds: [],
    clientName: 'Moroccan Innovation Circle',
    clientLogo: '/images/clients/mic.svg',
    date: '2024',
    featured: true,
    tags: ['web app', 'legal tech', 'SaaS', 'Morocco'],
  },
]

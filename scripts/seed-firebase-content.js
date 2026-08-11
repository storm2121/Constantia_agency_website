/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('node:path')
const sharp = require('sharp')
const { getFirestoreDb, getStorageBucket } = require('./firebase-admin.cjs')

const ROOT = path.resolve(__dirname, '..')
const bucket = getStorageBucket()
const db = getFirestoreDb()

const talents = [
  {
    id: 'younes-arbani',
    slug: 'younes-arbani',
    name: 'Younes Arbani',
    role: 'Chief Video and Photo',
    shortBio: "Image-maker leading Constantia's video and photography work across live events, films, and campaigns.",
    fullBio:
      'Younes Arbani is a multidisciplinary creator with 6 years of experience, based between Tiznit and Casablanca, Morocco. Specializing in photography, videography, graphic design, and social media management, he has worked with diverse clients including the French Institute of Agadir, US Embassy Morocco, Municipality of Tiznit, and various local businesses. His expertise spans concert event photography, street photography, advertising short films, music videography, podcast production, and social media content creation. Whether capturing the raw energy of live concerts, creating compelling advertising narratives, or managing complete social media strategies as a one-person crew, Younes brings a unique artistic vision that transforms brand messages into unforgettable visual experiences.',
    skills: [
      'Concert & Event Photography',
      'Street Photography',
      'Advertising Short Films',
      'Music Videography',
      'Podcast Production',
      'Social Media Management',
      'Graphic Design',
      'Social Media Carousels',
    ],
    clients: [
      { name: "L'blend", logo: '/images/clients/lblend.svg', url: 'https://lblend.org' },
      { name: 'Librabuzz', logo: '/images/clients/librabuzz.svg', url: 'https://librabuzz.com' },
      { name: 'Copima', logo: '/images/clients/copima.svg', url: 'https://copima.ma' },
      { name: 'Regisol', logo: '/images/clients/regisol.svg', url: 'https://regisol.com' },
      { name: 'Postera', logo: '/images/clients/postera.svg', url: 'https://postera.ma' },
    ],
    image: '/members/Younes-Arbani.jpeg',
    services: ['photo', 'video', 'design'],
    order: 1,
  },
  {
    id: 'youssef-azzouggarh',
    slug: 'youssef-azzouggarh',
    name: 'Youssef Azzouggarh',
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
    clients: [],
    image: '/members/Youssef-Azzouggarh.png',
    services: ['animation', 'video'],
    order: 2,
  },
  {
    id: 'brahim-dakouk',
    slug: 'brahim-dakouk',
    name: 'Brahim Dakouk',
    role: 'Chief Graphic Designer',
    shortBio: 'Graphic designer focused on identity systems, typography, and campaign composition.',
    fullBio:
      "Brahim Dakouk leads graphic design across Constantia's editorial, brand, and campaign work. His focus is on building visual systems that stay precise under pressure, from social assets to broader identity direction. A fuller biography and selected case studies will be added soon.",
    skills: [
      'Brand Identity',
      'Editorial Layout',
      'Campaign Design',
      'Typography',
      'Art Direction',
      'Visual Systems',
    ],
    clients: [],
    image: '/members/Brahim-Dakouk.jpeg',
    services: ['design'],
    order: 3,
  },
  {
    id: 'ayoub-ahnay',
    slug: 'ayoub-ahnay',
    name: 'Ayoub Ahnay',
    role: 'Associate Motion Graphics',
    shortBio: 'Motion designer and editor refining visuals with tempo, contrast, and disciplined finish.',
    fullBio:
      "Ayoub Ahnay is a seasoned video editor and motion graphics specialist with 8 years of experience in creating compelling visual content. He has served in key creative roles including Chief of Content Assistant at L'blend Creative Agency, Lead Video Editor at Eleven Digital, and Creative Director for multiple clients. Starting his career in graphic design and photography before transitioning to video editing in 2017, Ayoub has developed a unique approach that balances creative excellence with results-driven solutions. His expertise spans video editing, motion graphics, logo animation, and social media management, consistently delivering high-quality visual content that maintains artistic integrity while achieving client objectives.",
    skills: [
      'Video Editing',
      'Motion Graphics',
      'Logo Animation',
      'Reel Production',
      'Graphic Design',
      'Web Design',
      'Social Media Content',
      'Overhead / Talking Head Production',
    ],
    clients: [{ name: "L'blend Creative Agency", logo: '/images/clients/lblend.svg' }],
    image: '/members/Ayoub-Ahnay.jpg',
    services: ['animation', 'video', 'design'],
    order: 4,
  },
  {
    id: 'mohamed-el-hansali',
    slug: 'mohamed-el-hansali',
    name: 'Mohamed El Hansali',
    role: 'Chief Web Solutions',
    shortBio: 'Web solutions lead focused on platforms, systems, and operational clarity.',
    fullBio:
      "Mohamed El Hansali leads web solutions at Constantia, shaping platforms, practical automation, and durable systems for clients with complex needs. His work is centered on translating technical ambition into tools that feel clear, useful, and reliable in the real world. A fuller biography and selected case studies will be added soon.",
    skills: [
      'Web Strategy',
      'Workflow Automation',
      'Product Systems',
      'Solution Architecture',
      'Web Platforms',
    ],
    clients: [
      { name: 'Moroccan Innovation Circle', logo: '/images/clients/mic.svg' },
      { name: 'Groupe ESAI', logo: '/images/clients/esai.svg' },
    ],
    image: '/members/Mohamed_El_Hansali.jpeg',
    services: ['web'],
    order: 5,
  },
  {
    id: 'hatim-lachheb',
    slug: 'hatim-lachheb',
    name: 'Hatim Lachheb',
    role: 'Chief Strategy',
    shortBio: 'Strategy lead connecting clients, partnerships, and international opportunities across the MENA region.',
    fullBio:
      'Hatim Lachheb is an experienced entrepreneur and client relationship manager with a proven track record in building strategic partnerships across the MENA region and internationally. His international experience includes representing organizations at global events like COP27 and COP28, demonstrating strong cross-cultural communication skills with clients from Morocco, Egypt, and the UK. An alumnus of leadership programs from the Mohammed VI Foundation for Environmental Protection and Masdar, Hatim brings exceptional client management expertise gained through his experience with UNESCO and UNFCCC, enabling him to maintain long-term business relationships across different markets and deliver results for diverse clients.',
    skills: [
      'Strategic Partnerships',
      'Client Relationship Management',
      'Business Development',
      'Cross-cultural Communication',
      'International Event Representation',
      'Project Management',
      'MENA Market Expertise',
    ],
    clients: [
      { name: 'Renewable Energy and Sustainability Laboratory', logo: '/images/clients/al-akhawayn.svg' },
      { name: 'UNESCO Youth Forum', logo: '/images/clients/unesco.svg' },
      { name: 'Mohamed VI Foundation for Environmental Protection', logo: '/images/clients/mohamed-vi-foundation.svg' },
      { name: 'Regisol', logo: '/images/clients/regisol.svg' },
      { name: 'Masdar - Youth 4 Sustainability', logo: '/images/clients/masdar.svg' },
      { name: 'United Nations', logo: '/images/clients/united-nations.svg' },
    ],
    image: '/members/Hatim-Lachheb.jpg',
    services: ['strategy'],
    order: 6,
  },
  {
    id: 'achraf-el-ghazi',
    slug: 'achraf-el-ghazi',
    name: 'Achraf El Ghazi',
    role: 'Chief Software Engineer',
    shortBio: 'Software engineer building scalable platforms, booking systems, and polished digital products.',
    fullBio:
      'Achraf EL GHAZI is a Full Stack Web Developer and Software Engineer with two years of experience building scalable, high-performance web and mobile applications. With a portfolio of over 20 projects, Achraf has delivered impactful solutions such as Kudos, Wareflow, and Ken, serving clients including Al Akhawayn University. Passionate about crafting intuitive user experiences backed by robust architecture, he specializes in translating complex requirements into elegant, reliable, and future-ready digital products.',
    skills: [
      'Full Stack Development',
      'Web Applications',
      'Mobile Applications',
      'Scalable Architecture',
      'UX & Interface Design',
      'Booking & SaaS Platforms',
      'Database Design',
    ],
    clients: [{ name: 'Al Akhawayn University', logo: '/images/clients/al-akhawayn.svg' }],
    image: '/members/Achraf-ElGhazi.png',
    services: ['web'],
    order: 7,
  },
]

const projects = [
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
    thumbnail: '/images/portfolio/placeholders/photo-1.png',
    gallery: ['/images/portfolio/placeholders/photo-1.png'],
    mediaKind: 'image-gallery',
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    clientName: '',
    date: '2024',
    featured: true,
    tags: ['performance', 'atmosphere', 'live', 'photography'],
    caseStudyCredit: 'Photographer',
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
    thumbnail: '/images/portfolio/placeholders/photo-2.png',
    gallery: ['/images/portfolio/placeholders/photo-2.png'],
    mediaKind: 'image-gallery',
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    clientName: '',
    date: '2024',
    featured: false,
    tags: ['performance', 'stage', 'culture', 'photography'],
    caseStudyCredit: 'Photographer',
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
    thumbnail: '/images/portfolio/placeholders/photo-3.png',
    gallery: ['/images/portfolio/placeholders/photo-3.png'],
    mediaKind: 'image-gallery',
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    clientName: '',
    date: '2024',
    featured: false,
    tags: ['street', 'urban', 'documentary', 'photography'],
    caseStudyCredit: 'Photographer',
  },
  {
    id: 'revival-postera',
    slug: 'revival-postera',
    service: 'video',
    title: 'Revival - Advertising Short Film',
    shortDescription: 'A cinematic advertising film for Postera that evokes emotion and brand identity.',
    fullDescription:
      'In the realm of advertising short films, these cinematic creations not only convey client objectives but also evoke deep emotional connections and leave indelible impressions. With a flair for storytelling and meticulous attention to detail, this film captivates audiences, transforming brand messages and product features into unforgettable visual experiences.',
    type: 'video',
    category: 'advertising',
    thumbnail: '/images/portfolio/project-02-videography.jpg',
    gallery: ['/images/portfolio/project-02-videography.jpg'],
    mediaKind: 'image-gallery',
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    clientName: 'Postera',
    clientLogo: '/images/clients/postera.svg',
    date: '2024',
    featured: true,
    tags: ['advertising', 'short film', 'brand'],
    caseStudyCredit: 'Director / Cinematographer',
  },
  {
    id: 'biban-lkhir-waklisn',
    slug: 'biban-lkhir-waklisn',
    service: 'video',
    title: 'Biban Lkhir - Brand Film',
    shortDescription: 'A brand narrative film for WAKLISN that blends culture and storytelling.',
    fullDescription:
      'A cinematic brand film for WAKLISN, blending cultural narrative with visual storytelling. Biban Lkhir translates as "Good Doors" and the film captures this spirit through thoughtful cinematography and intentional pacing. Every second lands with meaning.',
    type: 'video',
    category: 'brand',
    thumbnail: '/images/portfolio/project-03-event.jpg',
    gallery: ['/images/portfolio/project-03-event.jpg'],
    mediaKind: 'image-gallery',
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    clientName: 'WAKLISN',
    date: '2024',
    featured: true,
    tags: ['brand film', 'cultural', 'narrative'],
  },
  {
    id: 'social-media-design-postera',
    slug: 'social-media-design-postera',
    service: 'design',
    title: 'Social Media Design - Postera',
    shortDescription: 'Complete social media visual system for Postera.ma.',
    fullDescription:
      'A complete social media content system for Postera, including carousels, posts, story assets, and campaign visuals. Each piece maintains brand consistency while adapting to platform-native formats. Clean, bold, and conversion-optimized.',
    type: 'design',
    category: 'social',
    thumbnail: '/images/portfolio/project-04-conference.jpg',
    gallery: ['/images/portfolio/project-04-conference.jpg'],
    mediaKind: 'image-gallery',
    primaryTalentId: 'younes-arbani',
    collaboratorTalentIds: [],
    clientName: 'Postera',
    clientLogo: '/images/clients/postera.svg',
    date: '2024',
    featured: false,
    tags: ['social media', 'design', 'brand identity'],
  },
  {
    id: 'logo-animation-reel',
    slug: 'logo-animation-reel',
    service: 'motion',
    title: 'Logo Animation Collection',
    shortDescription: 'Motion-crafted logo reveals for brands that want to be remembered.',
    fullDescription:
      'A curated collection of logo animations, each one designed to feel inevitable. Motion brings brand marks to life with purpose: timing, easing, and rhythm working together to reinforce identity. From minimal kinetic reveals to expressive motion sequences.',
    type: 'animation',
    category: 'brand',
    thumbnail: '/images/portfolio/project-05-landscape.jpg',
    gallery: ['/images/portfolio/project-05-landscape.jpg'],
    mediaKind: 'image-gallery',
    primaryTalentId: 'ayoub-ahnay',
    collaboratorTalentIds: [],
    clientName: 'Various',
    date: '2024',
    featured: true,
    tags: ['logo animation', 'motion graphics', 'brand'],
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

function absolutePublicPath(relativePath) {
  return path.resolve(ROOT, 'public', relativePath.replace(/^\//, ''))
}

async function uploadAsWebp(localRelativePath, destination) {
  const inputPath = absolutePublicPath(localRelativePath)
  const buffer = await sharp(inputPath).webp({ quality: 86 }).toBuffer()

  await bucket.file(destination).save(buffer, {
    resumable: false,
    metadata: {
      contentType: 'image/webp',
      cacheControl: 'public, max-age=31536000, immutable',
    },
  })

  return destination
}

async function seedTalents() {
  for (const talent of talents) {
    const imagePath = await uploadAsWebp(talent.image, `talents/${talent.id}/portrait/portrait.webp`)

    await db.collection('talents').doc(talent.id).set({
      id: talent.id,
      slug: talent.slug,
      name: talent.name,
      role: talent.role,
      shortBio: talent.shortBio,
      fullBio: talent.fullBio,
      skills: talent.skills,
      clients: talent.clients,
      imagePath,
      services: talent.services,
      order: talent.order,
      published: true,
    })

    console.log(`Talent seeded: ${talent.id}`)
  }
}

async function seedPortfolios() {
  const seedableProjects = projects.filter(
    (project) => project.service !== 'design' && project.service !== 'video'
  )

  for (let index = 0; index < seedableProjects.length; index += 1) {
    const project = seedableProjects[index]
    const thumbPath = await uploadAsWebp(
      project.thumbnail,
      `portfolios/${project.service}/${project.slug}/thumb/thumb.webp`
    )
    const heroPath = await uploadAsWebp(
      project.thumbnail,
      `portfolios/${project.service}/${project.slug}/hero/hero.webp`
    )

    const galleryPaths = []
    for (let galleryIndex = 0; galleryIndex < project.gallery.length; galleryIndex += 1) {
      const galleryPath = await uploadAsWebp(
        project.gallery[galleryIndex],
        `portfolios/${project.service}/${project.slug}/gallery/${String(galleryIndex + 1).padStart(2, '0')}.webp`
      )
      galleryPaths.push(galleryPath)
    }

    const posterPath = project.posterImage
      ? await uploadAsWebp(
          project.posterImage,
          `portfolios/${project.service}/${project.slug}/poster/poster.webp`
        )
      : undefined

    await db.collection('portfolioSummaries').doc(project.slug).set({
      id: project.id,
      slug: project.slug,
      service: project.service,
      type: project.type,
      category: project.category,
      title: project.title,
      shortDescription: project.shortDescription,
      thumbnailPath: thumbPath,
      posterPath,
      primaryTalentId: project.primaryTalentId,
      collaboratorTalentIds: project.collaboratorTalentIds,
      clientName: project.clientName,
      clientLogo: project.clientLogo,
      date: project.date,
      featured: project.featured,
      tags: project.tags,
      mediaKind: project.mediaKind,
      published: true,
      order: index,
    })

    await db.collection('portfolioDetails').doc(project.slug).set({
      slug: project.slug,
      service: project.service,
      primaryTalentId: project.primaryTalentId,
      fullDescription: project.fullDescription,
      heroPath,
      galleryPaths,
      mediaKind: project.mediaKind,
      posterPath,
      hlsManifestPath: project.hlsManifestPath,
      youtubeVideoId: project.youtubeVideoId,
      youtubeStartSeconds: project.youtubeStartSeconds,
      caseStudyCredit: project.caseStudyCredit,
      published: true,
    })

    console.log(`Portfolio seeded: ${project.slug}`)
  }
}

async function main() {
  await seedTalents()
  await seedPortfolios()
  console.log('Firebase content seed complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

export type DesignTalentPresentation = {
  role: string
  landingBio: string
  detailBio: string
  focus: string
}

const TALENT_OBJECT_POSITIONS: Record<string, string> = {
  'younes-arbani': '84% 34%',
}

const DESIGN_TALENT_PRESENTATIONS: Record<string, DesignTalentPresentation> = {
  'ayoub-ahnay': {
    role: 'Graphic Designer / Visual Systems',
    landingBio:
      "Ayoub's design work leans on strong composition, repeatable layout logic, and a motion-trained sense of pacing across still graphics.",
    detailBio:
      'Ayoub approaches graphic design through structure, contrast, and repeatable systems. Across covers, logos, posters, social formats, and interface concepts, the work stays disciplined and editorial while still feeling visually immediate.',
    focus: 'identity / posters / social systems',
  },
  'younes-arbani': {
    role: 'Graphic Designer / Social Campaigns',
    landingBio:
      'Younes builds campaign-minded design assets with a strong communication instinct, especially across carousels, product visuals, and social-first brand content.',
    detailBio:
      'Younes brings a communication-first approach to graphic design, using readable structure, brand consistency, and strong pacing to support real campaign needs. His design work is especially clear in educational carousels, brand assets, and short-form social reels.',
    focus: 'carousels / campaign assets / social reels',
  },
}

const DESIGN_COLLECTION_CREDITS: Record<string, string> = {
  'themgoodolddays-playlist-cover-system': 'Cover Art / Graphic Design',
  'logo-marks-selection': 'Identity Design / Logo Development',
  'poster-studies': 'Poster Design / Art Direction',
  'social-content-systems': 'Social Media Design / Visual Systems',
  'web-landing-concept': 'UI Concept / Graphic Design',
  'regisol-educational-carousels': 'Carousel Design / Brand Communication',
  'regisol-campaign-assets': 'Campaign Design / Visual Assets',
  'regisol-social-reels': 'Social Reels / Design Direction',
}

export function getTalentObjectPosition(talentId?: string | null) {
  if (!talentId) {
    return undefined
  }

  return TALENT_OBJECT_POSITIONS[talentId]
}

export function getDesignTalentPresentation(talentId?: string | null) {
  if (!talentId) {
    return undefined
  }

  return DESIGN_TALENT_PRESENTATIONS[talentId]
}

export function getDesignCollectionCredit(slug?: string | null) {
  if (!slug) {
    return undefined
  }

  return DESIGN_COLLECTION_CREDITS[slug]
}

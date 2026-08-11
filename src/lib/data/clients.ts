export interface Client {
  name: string
  logo: string
  url?: string
  talentIds: string[]
}

export const clients: Client[] = [
  // Younes clients
  { name: "L'blend", logo: '/images/clients/lblend.svg', url: 'https://lblend.org', talentIds: ['younes-arbani', 'ayoub-ahnay'] },
  { name: 'Librabuzz', logo: '/images/clients/librabuzz.svg', url: 'https://librabuzz.com', talentIds: ['younes-arbani'] },
  { name: 'Copima', logo: '/images/clients/copima.svg', url: 'https://copima.ma', talentIds: ['younes-arbani'] },
  { name: 'Regisol', logo: '/images/clients/regisol.svg', url: 'https://regisol.com', talentIds: ['younes-arbani', 'hatim-lachheb'] },
  { name: 'Postera', logo: '/images/clients/postera.svg', url: 'https://postera.ma', talentIds: ['younes-arbani'] },
  // Hatim clients
  { name: 'Al Akhawayn University', logo: '/images/clients/al-akhawayn.svg', talentIds: ['hatim-lachheb', 'achraf-el-ghazi'] },
  { name: 'UNESCO', logo: '/images/clients/unesco.svg', talentIds: ['hatim-lachheb'] },
  { name: 'Mohamed VI Foundation', logo: '/images/clients/mohamed-vi-foundation.svg', talentIds: ['hatim-lachheb'] },
  { name: 'Masdar', logo: '/images/clients/masdar.svg', talentIds: ['hatim-lachheb'] },
  { name: 'United Nations', logo: '/images/clients/united-nations.svg', talentIds: ['hatim-lachheb'] },
  // Mohamed clients
  { name: 'Moroccan Innovation Circle', logo: '/images/clients/mic.svg', talentIds: ['mohamed-el-hansali'] },
  { name: 'Groupe ESAI', logo: '/images/clients/esai.svg', talentIds: ['mohamed-el-hansali'] },
]

// Featured marquee clients (top-tier logos for homepage)
export const featuredClients = clients.filter((c) =>
  [
    'UNESCO',
    'United Nations',
    'Masdar',
    'Mohamed VI Foundation',
    "L'blend",
    'Al Akhawayn University',
    'Regisol',
    'Postera',
    'Copima',
  ].includes(c.name)
)

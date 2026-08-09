export type MomentVisual =
  | 'solar-orbit'
  | 'ribbon-bloom'
  | 'rising-sun'
  | 'joy-burst'
  | 'kind-heart'
  | 'ocean-moon'
  | 'birthday-night'
  | 'compass'
  | 'mountain'
  | 'planned-sky'
  | 'detour'
  | 'proposal-ring'
  | 'home-blueprint'
  | 'open-door'
  | 'hearth'
  | 'signatures'
  | 'chapel'
  | 'steady-anchor'
  | 'dance-floor'
  | 'honeymoon'
  | 'new-horizon'
  | 'southern-stars'
  | 'facets'
  | 'tree-rings'
  | 'books'
  | 'embrace'
  | 'laughter'
  | 'skyline'
  | 'road-ahead'
  | 'wish-star'

export type AmbientVariant =
  | 'embers'
  | 'orbits'
  | 'rays'
  | 'stars'
  | 'still'

export interface MomentConfig {
  ambient: AmbientVariant
  chapter: string
  id: number
  releaseAt: string
  visual: MomentVisual
}

export interface BirthdayConfig {
  authStorageKey: string
  passwordSha256: string
  previewQueryKey: string
  previewQueryValue: string
  readStorageKey: string
  timezoneLabel: string
  whatsappNumber: string
}

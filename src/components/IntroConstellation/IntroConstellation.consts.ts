export const INTRO_DURATION_MS = 3600
export const INTRO_FADE_OUT_MS = 620
export const INTRO_STAR_COUNT = 34

export const URSA_MAJOR_POINTS = [
  { x: 0.19, y: 0.38 },
  { x: 0.31, y: 0.51 },
  { x: 0.47, y: 0.48 },
  { x: 0.57, y: 0.35 },
  { x: 0.69, y: 0.31 },
  { x: 0.81, y: 0.37 },
  { x: 0.91, y: 0.49 },
] as const

export const URSA_MAJOR_EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [3, 4],
  [4, 5],
  [5, 6],
] as const

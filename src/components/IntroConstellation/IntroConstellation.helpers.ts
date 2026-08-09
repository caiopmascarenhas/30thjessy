import type { IntroStar } from './IntroConstellation.types'

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export const smoothstep = (start: number, end: number, value: number) => {
  if (start === end) {
    return value >= end ? 1 : 0
  }

  const normalized = clamp01((value - start) / (end - start))
  return normalized * normalized * (3 - 2 * normalized)
}

export const createIntroStars = (count: number): IntroStar[] => {
  let seed = 271615
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }

  return Array.from({ length: count }, () => ({
    alpha: 0.18 + random() * 0.34,
    phase: random() * Math.PI * 2,
    radius: 0.45 + random() * 0.9,
    x: random(),
    y: random(),
  }))
}

import type {
  AmbientParticle,
  ConstellationEdge,
  ConstellationNode,
} from './AmbientCanvas.types'

const pseudoRandom = (seed: number): number => {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

export const createParticles = (
  count: number,
  width: number,
  height: number,
): AmbientParticle[] =>
  Array.from({ length: count }, (_, index) => ({
    alpha: 0.18 + pseudoRandom(index + 31) * 0.5,
    drift: 5 + pseudoRandom(index + 51) * 15,
    radius: 0.45 + pseudoRandom(index + 71) * 1.35,
    seed: pseudoRandom(index + 91) * Math.PI * 2,
    speed: 0.00024 + pseudoRandom(index + 111) * 0.00054,
    x: pseudoRandom(index + 131) * width,
    y: pseudoRandom(index + 151) * height,
  }))

const NORMALIZED_CONSTELLATION_NODES = [
  [0.09, 0.2, 0.82],
  [0.17, 0.12, 1],
  [0.27, 0.2, 0.72],
  [0.19, 0.31, 0.88],
  [0.34, 0.3, 0.7],
  [0.42, 0.2, 0.92],
  [0.39, 0.63, 0.72],
  [0.49, 0.55, 0.94],
  [0.53, 0.72, 1],
  [0.65, 0.66, 0.88],
  [0.7, 0.2, 0.74],
  [0.79, 0.12, 0.98],
  [0.88, 0.2, 0.84],
  [0.82, 0.33, 0.9],
] as const

const EDGE_PAIRS = [
  [0, 1],
  [1, 2],
  [1, 3],
  [2, 5],
  [3, 4],
  [6, 7],
  [7, 8],
  [7, 9],
  [10, 11],
  [11, 12],
  [12, 13],
] as const

export const createConstellationNodes = (
  width: number,
  height: number,
): ConstellationNode[] => {
  const horizontalInset = width < 768 ? 0.02 : 0
  const verticalScale = height > width * 1.35 ? 0.9 : 1

  return NORMALIZED_CONSTELLATION_NODES.map(([x, y, prominence], index) => ({
    prominence,
    seed: pseudoRandom(index + 401) * Math.PI * 2,
    x: width * (horizontalInset + x * (1 - horizontalInset * 2)),
    y: height * (0.05 + y * 0.9 * verticalScale),
  }))
}

export const createConstellationEdges = (): ConstellationEdge[] =>
  EDGE_PAIRS.map(([from, to], index) => ({
    from,
    phase: pseudoRandom(index + 501),
    to,
  }))

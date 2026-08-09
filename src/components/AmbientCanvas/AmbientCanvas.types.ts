import type { AmbientVariant } from '~/config'

export interface AmbientCanvasProps {
  intensity?: number
  variant?: AmbientVariant
}

export interface AmbientParticle {
  alpha: number
  drift: number
  radius: number
  seed: number
  speed: number
  x: number
  y: number
}

export interface ConstellationNode {
  prominence: number
  seed: number
  x: number
  y: number
}

export interface ConstellationEdge {
  from: number
  phase: number
  to: number
}

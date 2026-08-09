import { useEffect, useRef } from 'react'

import { useReducedMotion } from '~/hooks'
import { musicService } from '~/music'
import type { MusicLevels, MusicVisualFrame } from '~/music'
import { theme } from '~/theme'

import {
  createConstellationEdges,
  createConstellationNodes,
  createParticles,
} from './AmbientCanvas.helpers'
import { styles } from './AmbientCanvas.styles'
import type {
  AmbientCanvasProps,
  AmbientParticle,
  ConstellationEdge,
  ConstellationNode,
} from './AmbientCanvas.types'

const TWO_PI = Math.PI * 2

const EMPTY_LEVELS: MusicLevels = {
  air: 0,
  bass: 0,
  energy: 0,
  high: 0,
  lowMid: 0,
  mid: 0,
  presence: 0,
  subBass: 0,
  transient: 0,
}

const getBandLevel = (levels: MusicLevels, band: number): number => {
  switch (band % 7) {
    case 0:
      return levels.subBass
    case 1:
      return levels.bass
    case 2:
      return levels.lowMid
    case 3:
      return levels.mid
    case 4:
      return levels.presence
    case 5:
      return levels.high
    default:
      return levels.air
  }
}

export const AmbientCanvas = ({
  intensity = 1,
  variant = 'stars',
}: AmbientCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    })

    if (!context) {
      return
    }

    let width = 1
    let height = 1
    let renderScale = 0.7
    let particles: AmbientParticle[] = []
    let nodes: ConstellationNode[] = []
    let edges: ConstellationEdge[] = []
    let positions = new Float32Array(0)
    let signalPhase = 0
    let orbitPhase = 0
    let beatImpulse = 0
    let beatCooldownMs = 0

    const resize = () => {
      width = Math.max(1, window.innerWidth)
      height = Math.max(1, window.innerHeight)

      // Resolução interna limitada. A animação continua ocupando 100% do viewport,
      // mas o custo não cresce junto com Retina/4K.
      renderScale = Math.min(0.82, 1120 / width, 720 / height)
      renderScale = Math.max(0.42, renderScale)

      canvas.width = Math.max(1, Math.floor(width * renderScale))
      canvas.height = Math.max(1, Math.floor(height * renderScale))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(renderScale, 0, 0, renderScale, 0, 0)
      context.lineCap = 'round'
      context.lineJoin = 'round'

      const compact = width < 768
      particles = createParticles(compact ? 12 : 18, width, height)
      nodes = createConstellationNodes(width, height)
      edges = createConstellationEdges()
      positions = new Float32Array(nodes.length * 2)
    }

    const renderFrame = ({ deltaMs, isPlaying, levels, time }: MusicVisualFrame) => {
      if (document.visibilityState !== 'visible') {
        return
      }

      try {
        const activeLevels = reducedMotion ? EMPTY_LEVELS : levels
        const safeDeltaMs = Math.min(32, Math.max(1, deltaMs))
        const deltaSeconds = safeDeltaMs / 1000

        if (!reducedMotion && isPlaying) {
          signalPhase =
            (signalPhase +
              deltaSeconds * (0.08 + activeLevels.mid * 0.11 + activeLevels.presence * 0.07)) %
            1
          orbitPhase += deltaSeconds * (0.055 + activeLevels.lowMid * 0.08)
        }

        beatCooldownMs = Math.max(0, beatCooldownMs - safeDeltaMs)

        if (
          !reducedMotion &&
          isPlaying &&
          beatCooldownMs <= 0 &&
          (activeLevels.transient > 0.28 || activeLevels.bass > 0.7)
        ) {
          beatImpulse = Math.min(1, 0.4 + activeLevels.transient * 0.5)
          beatCooldownMs = 135
        }

        beatImpulse *= Math.exp(-safeDeltaMs / 200)

        for (let index = 0; index < nodes.length; index += 1) {
          const node = nodes[index]

          if (!node) {
            continue
          }

          const band = getBandLevel(activeLevels, index)
          const amplitude = 1.4 + band * 4.2 + activeLevels.energy * 1.2
          const offset = index * 2

          positions[offset] =
            node.x + Math.sin(time * (0.18 + (index % 4) * 0.018) + node.seed) * amplitude
          positions[offset + 1] =
            node.y +
            Math.cos(time * (0.15 + (index % 5) * 0.014) + node.seed * 1.17) *
              amplitude *
              0.58
        }

        context.clearRect(0, 0, width, height)

        // Linhas da constelação em um único stroke.
        context.beginPath()

        for (let index = 0; index < edges.length; index += 1) {
          const edge = edges[index]

          if (!edge) {
            continue
          }

          const fromOffset = edge.from * 2
          const toOffset = edge.to * 2

          context.moveTo(positions[fromOffset] ?? 0, positions[fromOffset + 1] ?? 0)
          context.lineTo(positions[toOffset] ?? 0, positions[toOffset + 1] ?? 0)
        }

        context.strokeStyle = `rgba(215,180,96,${(0.04 + activeLevels.energy * 0.035) * intensity})`
        context.lineWidth = 0.62 + activeLevels.lowMid * 0.24
        context.stroke()

        // Pontos soltos de fundo.
        for (let index = 0; index < particles.length; index += 1) {
          const particle = particles[index]

          if (!particle) {
            continue
          }

          const band = getBandLevel(activeLevels, index + 2)
          const x =
            particle.x +
            Math.sin(time * (0.08 + particle.speed * 180) + particle.seed) *
              particle.drift *
              0.18
          const y =
            particle.y +
            Math.cos(time * (0.06 + particle.speed * 130) + particle.seed) *
              particle.drift *
              0.1
          const radius = particle.radius * (0.9 + band * 0.7)

          context.beginPath()
          context.arc(x, y, radius, 0, TWO_PI)
          context.fillStyle = `rgba(255,226,148,${particle.alpha * (0.42 + band * 0.48) * intensity})`
          context.fill()
        }

        // Estrelas principais.
        for (let index = 0; index < nodes.length; index += 1) {
          const node = nodes[index]

          if (!node) {
            continue
          }

          const band = getBandLevel(activeLevels, index)
          const offset = index * 2
          const radius =
            0.9 + node.prominence * 1.15 + band * 1.25 + (index === 1 ? beatImpulse * 1.4 : 0)

          context.beginPath()
          context.arc(positions[offset] ?? node.x, positions[offset + 1] ?? node.y, radius, 0, TWO_PI)
          context.fillStyle = `rgba(255,226,148,${Math.min(0.9, (0.28 + node.prominence * 0.28 + band * 0.3) * intensity)})`
          context.fill()
        }

        // Um único brilho percorre as conexões e dá sensação de música correndo pela constelação.
        if (edges.length > 0) {
          const edgeIndex = Math.floor(signalPhase * edges.length) % edges.length
          const edge = edges[edgeIndex]

          if (edge) {
            const localTravel = signalPhase * edges.length - Math.floor(signalPhase * edges.length)
            const fromOffset = edge.from * 2
            const toOffset = edge.to * 2
            const fromX = positions[fromOffset] ?? 0
            const fromY = positions[fromOffset + 1] ?? 0
            const toX = positions[toOffset] ?? 0
            const toY = positions[toOffset + 1] ?? 0
            const x = fromX + (toX - fromX) * localTravel
            const y = fromY + (toY - fromY) * localTravel

            context.beginPath()
            context.arc(x, y, 1.4 + activeLevels.presence * 1.8, 0, TWO_PI)
            context.fillStyle = `rgba(255,226,148,${(0.45 + activeLevels.presence * 0.45) * intensity})`
            context.fill()
          }
        }

        // Variantes continuam existindo, porém como detalhes leves de constelação.
        if (variant === 'orbits') {
          const cx = width * 0.72
          const cy = height * 0.56
          const base = Math.min(width, height) * 0.12

          context.save()
          context.translate(cx, cy)
          context.rotate(orbitPhase)
          context.beginPath()
          context.ellipse(0, 0, base * 1.65, base * 0.72, 0, 0, TWO_PI)
          context.ellipse(0, 0, base, base * 0.46, Math.PI * 0.42, 0, TWO_PI)
          context.strokeStyle = `rgba(215,180,96,${(0.035 + activeLevels.mid * 0.045) * intensity})`
          context.lineWidth = 0.55
          context.stroke()
          context.restore()
        } else if (variant === 'rays') {
          const cx = width * 0.22
          const cy = height * 0.7
          const radius = Math.min(width, height) * 0.15

          context.beginPath()
          context.arc(cx, cy, radius, orbitPhase, orbitPhase + 0.75 + activeLevels.high * 0.45)
          context.arc(
            cx,
            cy,
            radius * 1.4,
            -orbitPhase * 0.72,
            -orbitPhase * 0.72 + 0.62 + activeLevels.presence * 0.4,
          )
          context.strokeStyle = `rgba(215,180,96,${(0.03 + activeLevels.high * 0.05) * intensity})`
          context.lineWidth = 0.55
          context.stroke()
        }
      } catch (error) {
        console.error('[ambient] Não foi possível renderizar a constelação ambiente.', error)
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    if (reducedMotion) {
      renderFrame({ deltaMs: 16.67, isPlaying: false, levels: EMPTY_LEVELS, time: 0 })
    }

    const unsubscribeFrame = reducedMotion
      ? () => undefined
      : musicService.subscribeFrame(renderFrame)

    return () => {
      unsubscribeFrame()
      window.removeEventListener('resize', resize)
    }
  }, [intensity, reducedMotion, variant])

  return (
    <canvas
      aria-hidden="true"
      ref={canvasRef}
      style={{ ...styles.Canvas, backgroundColor: theme.colors.background }}
    />
  )
}

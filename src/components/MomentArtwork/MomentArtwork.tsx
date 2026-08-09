import { useEffect, useMemo, useRef } from 'react'

import { useReducedMotion } from '~/hooks'
import { musicService } from '~/music'
import type { MusicLevels, MusicVisualFrame } from '~/music'
import { theme } from '~/theme'

import { createMomentConstellation } from './MomentArtwork.helpers'
import { styles } from './MomentArtwork.styles'
import type { MomentArtworkProps } from './MomentArtwork.types'

const TWO_PI = Math.PI * 2
const VIEW_SIZE = 500
const CANVAS_SIZE = 600
const CANVAS_SCALE = CANVAS_SIZE / VIEW_SIZE

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

export const MomentArtwork = ({ momentId }: MomentArtworkProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()
  const constellation = useMemo(() => createMomentConstellation(momentId), [momentId])

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

    context.setTransform(CANVAS_SCALE, 0, 0, CANVAS_SCALE, 0, 0)
    context.lineCap = 'round'
    context.lineJoin = 'round'

    const positions = new Float32Array(constellation.stars.length * 2)
    let rotationPhase = momentId * 0.023
    let driftPhase = momentId * 0.37
    let signalPhase = (momentId * 0.071) % 1
    let beatImpulse = 0
    let beatIndex = momentId % Math.max(1, constellation.stars.length)
    let beatCooldownMs = 0

    const draw = ({ deltaMs, isPlaying, levels }: MusicVisualFrame) => {
      if (document.visibilityState !== 'visible') {
        return
      }

      try {
        const activeLevels = reducedMotion ? EMPTY_LEVELS : levels
        const safeDeltaMs = Math.min(32, Math.max(1, deltaMs))
        const deltaSeconds = safeDeltaMs / 1000

        if (!reducedMotion && isPlaying) {
          driftPhase += deltaSeconds * (0.34 + activeLevels.mid * 0.28 + activeLevels.presence * 0.15)
          rotationPhase +=
            deltaSeconds *
            constellation.rotationDirection *
            (0.006 + activeLevels.lowMid * 0.012 + activeLevels.energy * 0.004)
          signalPhase =
            (signalPhase +
              deltaSeconds * (0.09 + activeLevels.mid * 0.12 + activeLevels.presence * 0.08)) %
            1
        }

        beatCooldownMs = Math.max(0, beatCooldownMs - safeDeltaMs)

        if (
          !reducedMotion &&
          isPlaying &&
          beatCooldownMs <= 0 &&
          (activeLevels.transient > 0.24 || activeLevels.bass > 0.66)
        ) {
          beatImpulse = Math.min(
            1,
            0.38 + activeLevels.transient * 0.54 + activeLevels.bass * 0.2,
          )
          beatIndex = (beatIndex + 3 + (momentId % 5)) % constellation.stars.length
          beatCooldownMs = 125
        }

        beatImpulse *= Math.exp(-safeDeltaMs / 185)

        const cosRotation = Math.cos(rotationPhase)
        const sinRotation = Math.sin(rotationPhase)

        for (let index = 0; index < constellation.stars.length; index += 1) {
          const star = constellation.stars[index]

          if (!star) {
            continue
          }

          const band = getBandLevel(activeLevels, star.band)
          const amplitude = star.drift * (0.18 + band * 0.9 + activeLevels.energy * 0.16)
          const localX =
            star.x +
            Math.sin(driftPhase * (0.82 + (index % 5) * 0.035) + star.phase) * amplitude -
            250
          const localY =
            star.y +
            Math.cos(driftPhase * (0.68 + (index % 4) * 0.04) + star.phase * 1.13) *
              amplitude *
              0.62 -
            250
          const offset = index * 2

          positions[offset] = 250 + localX * cosRotation - localY * sinRotation
          positions[offset + 1] = 250 + localX * sinRotation + localY * cosRotation
        }

        context.clearRect(0, 0, VIEW_SIZE, VIEW_SIZE)

        // Todas as conexões são desenhadas em uma única operação. Isso evita dezenas de
        // strokes por frame e mantém a constelação suave mesmo em telas Retina/4K.
        context.beginPath()

        for (let index = 0; index < constellation.links.length; index += 1) {
          const link = constellation.links[index]

          if (!link) {
            continue
          }

          const fromOffset = link.from * 2
          const toOffset = link.to * 2
          const fromX = positions[fromOffset] ?? 0
          const fromY = positions[fromOffset + 1] ?? 0
          const toX = positions[toOffset] ?? 0
          const toY = positions[toOffset + 1] ?? 0

          context.moveTo(fromX, fromY)
          context.lineTo(toX, toY)
        }

        context.strokeStyle = `rgba(215,180,96,${0.12 + activeLevels.energy * 0.08 + activeLevels.mid * 0.04})`
        context.lineWidth = 0.72 + activeLevels.lowMid * 0.36
        context.stroke()

        // Pequenos sinais percorrem somente algumas conexões. Eles seguem a música,
        // mas sem criar/remover DOM ou objetos de animação a cada batida.
        const signalCount = activeLevels.energy > 0.1 ? Math.min(6, constellation.links.length) : 2

        for (let index = 0; index < signalCount; index += 1) {
          const linkIndex = (index * 3 + momentId) % constellation.links.length
          const link = constellation.links[linkIndex]

          if (!link) {
            continue
          }

          const band = getBandLevel(activeLevels, link.band)

          if (band < 0.055 && activeLevels.energy < 0.08) {
            continue
          }

          const fromOffset = link.from * 2
          const toOffset = link.to * 2
          const fromX = positions[fromOffset] ?? 0
          const fromY = positions[fromOffset + 1] ?? 0
          const toX = positions[toOffset] ?? 0
          const toY = positions[toOffset + 1] ?? 0
          const travel = (signalPhase + link.phase + index * 0.17) % 1
          const x = fromX + (toX - fromX) * travel
          const y = fromY + (toY - fromY) * travel
          const radius = 1.1 + band * 1.65 + activeLevels.transient * 0.45

          context.beginPath()
          context.arc(x, y, radius, 0, TWO_PI)
          context.fillStyle = `rgba(255,226,148,${0.4 + band * 0.5})`
          context.fill()
        }

        for (let index = 0; index < constellation.stars.length; index += 1) {
          const star = constellation.stars[index]

          if (!star) {
            continue
          }

          const band = getBandLevel(activeLevels, star.band)
          const offset = index * 2
          const x = positions[offset] ?? star.x
          const y = positions[offset + 1] ?? star.y
          const twinkle = reducedMotion
            ? 0
            : Math.sin(driftPhase * (2.1 + (index % 4) * 0.12) + star.phase) *
              (0.08 + activeLevels.air * 0.12)
          const beatBoost = index === beatIndex ? beatImpulse : 0
          const radius =
            1.15 +
            star.prominence * 2.2 +
            band * (1.4 + star.prominence * 0.85) +
            beatBoost * 2.1
          const alpha = Math.min(
            1,
            0.34 + star.prominence * 0.34 + band * 0.32 + twinkle + beatBoost * 0.22,
          )

          context.beginPath()
          context.arc(x, y, radius, 0, TWO_PI)
          context.fillStyle = `rgba(255,226,148,${alpha})`
          context.fill()
        }

        if (beatImpulse > 0.08) {
          const offset = beatIndex * 2
          const x = positions[offset] ?? 250
          const y = positions[offset + 1] ?? 250

          context.beginPath()
          context.arc(x, y, 8 + beatImpulse * 24, 0, TWO_PI)
          context.strokeStyle = `rgba(244,218,138,${beatImpulse * 0.2})`
          context.lineWidth = 0.65
          context.stroke()
        }
      } catch (error) {
        console.error('[artwork] Não foi possível renderizar a constelação.', error)
      }
    }

    if (reducedMotion) {
      draw({ deltaMs: 16.67, isPlaying: false, levels: EMPTY_LEVELS, time: 0 })
      return
    }

    return musicService.subscribeFrame(draw)
  }, [constellation, momentId, reducedMotion])

  return (
    <div style={styles.Frame}>
      <canvas
        aria-hidden="true"
        height={CANVAS_SIZE}
        ref={canvasRef}
        style={styles.Canvas}
        width={CANVAS_SIZE}
      />

      <span style={styles.Number}>{String(momentId).padStart(2, '0')}</span>

      <span style={styles.Badge}>
        <span
          style={{
            background: theme.colors.goldBright,
            borderRadius: theme.radii.circle,
            boxShadow: '0 0 10px rgba(244,218,138,0.55)',
            height: 5,
            width: 5,
          }}
        />
        30 anos · capítulo {String(momentId).padStart(2, '0')}
      </span>
    </div>
  )
}

import { useEffect, useMemo, useRef } from 'react'

import { useReducedMotion } from '~/hooks'

import {
  INTRO_DURATION_MS,
  INTRO_FADE_OUT_MS,
  INTRO_STAR_COUNT,
  URSA_MAJOR_EDGES,
  URSA_MAJOR_POINTS,
} from './IntroConstellation.consts'
import { clamp01, createIntroStars, smoothstep } from './IntroConstellation.helpers'
import { styles } from './IntroConstellation.styles'
import type { IntroConstellationProps } from './IntroConstellation.types'

const TWO_PI = Math.PI * 2

export const IntroConstellation = ({ onComplete }: IntroConstellationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const backgroundStars = useMemo(() => createIntroStars(INTRO_STAR_COUNT), [])

  useEffect(() => {
    const canvas = canvasRef.current
    const copy = copyRef.current

    if (!canvas || !copy) {
      onComplete()
      return
    }

    const context = canvas.getContext('2d', { alpha: false, desynchronized: true })

    if (!context) {
      onComplete()
      return
    }

    const duration = reducedMotion ? 1200 : INTRO_DURATION_MS
    const fadeOutStart = Math.max(0, duration - (reducedMotion ? 280 : INTRO_FADE_OUT_MS))
    let frameId = 0
    let fallbackTimer = 0
    let startedAt = performance.now()
    let width = 1
    let height = 1
    let completed = false

    const finish = () => {
      if (completed) {
        return
      }

      completed = true
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(fallbackTimer)
      onComplete()
    }

    const resize = () => {
      width = Math.max(1, window.innerWidth)
      height = Math.max(1, window.innerHeight)
      const pixelRatio = Math.min(window.devicePixelRatio || 1, width < 768 ? 1 : 1.15)

      canvas.width = Math.floor(width * pixelRatio)
      canvas.height = Math.floor(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const draw = (now: number) => {
      if (completed) {
        return
      }

      const elapsed = now - startedAt
      const progress = clamp01(elapsed / duration)
      const sceneOpacity = 1 - smoothstep(fadeOutStart / duration, 1, progress)

      context.globalAlpha = 1
      context.fillStyle = '#070706'
      context.fillRect(0, 0, width, height)

      const backgroundReveal = smoothstep(0, reducedMotion ? 0.12 : 0.22, progress)

      for (let index = 0; index < backgroundStars.length; index += 1) {
        const star = backgroundStars[index]

        if (!star) {
          continue
        }

        const twinkle = reducedMotion ? 0.88 : 0.78 + Math.sin(now * 0.0013 + star.phase) * 0.22
        const alpha = star.alpha * backgroundReveal * sceneOpacity * twinkle

        context.beginPath()
        context.arc(star.x * width, star.y * height, star.radius, 0, TWO_PI)
        context.fillStyle = `rgba(244,218,138,${alpha})`
        context.fill()
      }

      const constellationWidth = Math.min(width * 0.74, 720)
      const constellationHeight = Math.min(height * 0.34, 285)
      const originX = (width - constellationWidth) / 2
      const originY = height * 0.23
      const points = URSA_MAJOR_POINTS.map((point) => ({
        x: originX + point.x * constellationWidth,
        y: originY + point.y * constellationHeight,
      }))

      for (let edgeIndex = 0; edgeIndex < URSA_MAJOR_EDGES.length; edgeIndex += 1) {
        const edge = URSA_MAJOR_EDGES[edgeIndex]

        if (!edge) {
          continue
        }

        const [fromIndex, toIndex] = edge
        const from = points[fromIndex]
        const to = points[toIndex]

        if (!from || !to) {
          continue
        }

        const start = (reducedMotion ? 0.12 : 0.19) + edgeIndex * (reducedMotion ? 0.025 : 0.045)
        const lineProgress = smoothstep(start, start + (reducedMotion ? 0.16 : 0.2), progress)

        if (lineProgress <= 0) {
          continue
        }

        context.beginPath()
        context.moveTo(from.x, from.y)
        context.lineTo(
          from.x + (to.x - from.x) * lineProgress,
          from.y + (to.y - from.y) * lineProgress,
        )
        context.strokeStyle = `rgba(215,180,96,${0.38 * sceneOpacity * lineProgress})`
        context.lineWidth = 0.85
        context.stroke()
      }

      for (let index = 0; index < points.length; index += 1) {
        const point = points[index]

        if (!point) {
          continue
        }

        const start = (reducedMotion ? 0.06 : 0.1) + index * (reducedMotion ? 0.025 : 0.052)
        const reveal = smoothstep(start, start + 0.13, progress)

        if (reveal <= 0) {
          continue
        }

        const pulse = reducedMotion ? 0 : Math.sin(now * 0.0026 + index * 0.72) * 0.08
        const radius = (index === 0 || index === 3 ? 5.2 : 3.8) * (0.86 + reveal * 0.14 + pulse)

        context.beginPath()
        context.arc(point.x, point.y, radius, 0, TWO_PI)
        context.fillStyle = `rgba(244,218,138,${0.94 * reveal * sceneOpacity})`
        context.fill()
      }

      const copyReveal = smoothstep(reducedMotion ? 0.42 : 0.58, reducedMotion ? 0.63 : 0.76, progress)
      copy.style.opacity = `${copyReveal * sceneOpacity}`
      copy.style.transform = `translate3d(0, ${(1 - copyReveal) * 10}px, 0)`

      if (progress >= 1) {
        finish()
        return
      }

      frameId = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    startedAt = performance.now()
    fallbackTimer = window.setTimeout(finish, duration + 900)
    frameId = window.requestAnimationFrame(draw)

    return () => {
      completed = true
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(fallbackTimer)
      window.removeEventListener('resize', resize)
    }
  }, [backgroundStars, onComplete, reducedMotion])

  return (
    <div style={styles.Container}>
      <canvas aria-hidden="true" ref={canvasRef} style={styles.Canvas} />
      <div ref={copyRef} style={{ ...styles.Copy, opacity: 0 }}>
        <p style={styles.Eyebrow}>Ursa Maior · sete estrelas</p>
        <h1 style={styles.Title}>Uma história escrita no céu.</h1>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

import { musicService, useMusicPlayer } from '~/music'
import type { MusicVisualFrame } from '~/music'
import { theme } from '~/theme'
import { useReducedMotion, useViewport } from '~/hooks'

import { styles } from './MusicPlayer.styles'
import type { MusicPlayerProps } from './MusicPlayer.types'

const PlayIcon = () => (
  <svg aria-hidden="true" height="12" viewBox="0 0 12 12" width="12">
    <path d="M3 1.8 10 6 3 10.2Z" fill="currentColor" />
  </svg>
)

const PauseIcon = () => (
  <svg aria-hidden="true" height="12" viewBox="0 0 12 12" width="12">
    <rect fill="currentColor" height="8.4" rx="0.8" width="2.3" x="2.2" y="1.8" />
    <rect fill="currentColor" height="8.4" rx="0.8" width="2.3" x="7.5" y="1.8" />
  </svg>
)

export const MusicPlayer = ({ compact = false }: MusicPlayerProps) => {
  const { error, isPlaying } = useMusicPlayer()
  const reducedMotion = useReducedMotion()
  const viewport = useViewport()
  const barRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [busy, setBusy] = useState(false)
  const showLabel = !compact && viewport.kind !== 'mobile'

  useEffect(() => {
    if (reducedMotion) {
      return
    }

    let visualEnergy = 0

    const smooth = (
      current: number,
      target: number,
      deltaMs: number,
      attackMs: number,
      releaseMs: number,
    ) => {
      const timeConstant = target > current ? attackMs : releaseMs
      const factor = 1 - Math.exp(-deltaMs / Math.max(1, timeConstant))

      return current + (target - current) * factor
    }

    const animate = ({ deltaMs, levels }: MusicVisualFrame) => {
      const safeDeltaMs = Math.min(34, Math.max(1, deltaMs))
      const target = isPlaying ? Math.max(levels.energy, levels.mid * 0.78) : 0

      visualEnergy = smooth(visualEnergy, target, safeDeltaMs, 30, 145)

      barRefs.current.forEach((bar, index) => {
        if (!bar) {
          return
        }

        const band = index === 0 ? levels.bass : index === 1 ? levels.mid : levels.high
        const scale = 0.32 + Math.max(visualEnergy, band) * (index === 1 ? 0.86 : 0.7)

        bar.style.transform = `scaleY(${Math.min(1.28, scale)})`
        bar.style.opacity = `${0.5 + visualEnergy * 0.48}`
      })
    }

    return musicService.subscribeFrame(animate)
  }, [isPlaying, reducedMotion])

  const handleToggle = async () => {
    if (busy) {
      return
    }

    setBusy(true)

    try {
      await musicService.toggle()
    } catch (toggleError) {
      console.error('[music-control] Não foi possível alternar a música.', toggleError)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={styles.Root}>
      {error ? <span style={styles.Error}>{error}</span> : null}
      <button
        aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
        data-music-control="true"
        disabled={busy}
        onClick={() => void handleToggle()}
        style={{ ...styles.Control, opacity: busy ? 0.72 : 1 }}
        title={isPlaying ? 'Pausar música' : 'Tocar música'}
        type="button"
      >
        <span style={styles.IconCircle}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</span>

        <span aria-hidden="true" style={styles.Bars}>
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              ref={(element) => {
                barRefs.current[index] = element
              }}
              style={{
                background: theme.colors.goldBright,
                borderRadius: theme.radii.pill,
                height: 13,
                opacity: 0.52,
                transform: reducedMotion ? `scaleY(${0.45 + index * 0.18})` : 'scaleY(0.35)',
                transformOrigin: 'center bottom',
                transition: reducedMotion ? 'none' : 'opacity 120ms ease',
                willChange: reducedMotion ? 'auto' : 'transform, opacity',
                width: 2,
              }}
            />
          ))}
        </span>

        {showLabel ? (
          <span style={styles.Label}>
            <span style={styles.Title}>golden hour · instrumental</span>
            <span style={styles.Track}>{isPlaying ? 'tocando agora' : 'música pausada'}</span>
          </span>
        ) : null}
      </button>
    </div>
  )
}

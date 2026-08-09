import { useState } from 'react'

import { theme } from '~/theme'
import { formatReleaseDate, isMomentUnlocked } from '~/utils'

import { styles } from './ProgressConstellation.styles'
import type { ProgressConstellationProps } from './ProgressConstellation.types'

interface NodeProps {
  chapter: string
  id: number
  isRead: boolean
  isUnlocked: boolean
  onSelect: (id: number) => void
  releaseAt: string
}

const ProgressNode = ({
  chapter,
  id,
  isRead,
  isUnlocked,
  onSelect,
  releaseAt,
}: NodeProps) => {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const active = isUnlocked && (hovered || focused)
  const releaseDate = formatReleaseDate(releaseAt)

  return (
    <button
      aria-label={
        isUnlocked
          ? `Abrir momento ${id}: ${chapter}`
          : `Momento ${id} bloqueado até ${releaseDate}`
      }
      disabled={!isUnlocked}
      onBlur={() => setFocused(false)}
      onClick={() => onSelect(id)}
      onFocus={() => setFocused(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.NodeRoot,
        background: isUnlocked
          ? active
            ? 'linear-gradient(145deg, rgba(215,180,96,0.15), rgba(255,255,255,0.025))'
            : 'rgba(255,255,255,0.028)'
          : 'rgba(255,255,255,0.014)',
        border: `1px solid ${
          active
            ? 'rgba(244,218,138,0.52)'
            : isUnlocked
              ? 'rgba(215,180,96,0.19)'
              : 'rgba(255,255,255,0.055)'
        }`,
        boxShadow: active ? theme.shadows.goldGlow : 'none',
        color: isUnlocked ? theme.colors.text : theme.colors.muted,
        cursor: isUnlocked ? 'pointer' : 'not-allowed',
        outline: focused ? `2px solid ${theme.colors.goldBright}` : 'none',
        outlineOffset: 2,
        opacity: isUnlocked ? 1 : 0.58,
        transform: active ? 'translateY(-3px)' : 'translateY(0)',
        transition:
          'transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease',
      }}
      type="button"
    >
      <span
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(135deg, rgba(244,218,138,1), rgba(183,131,46,0.74))',
          height: 1,
          opacity: isUnlocked ? 1 : 0.22,
          position: 'absolute',
          right: 13,
          top: 13,
          width: 24,
        }}
      />

      <span style={styles.NodeNumber}>{String(id).padStart(2, '0')}</span>

      <span style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
        <span style={styles.NodeChapter}>{chapter}</span>
        <span
          style={{
            ...styles.Status,
            color: isUnlocked ? theme.colors.goldBright : theme.colors.muted,
          }}
        >
          <span
            style={{
              ...styles.StatusDot,
              background: isUnlocked
                ? isRead
                  ? theme.colors.gold
                  : theme.colors.goldBright
                : 'rgba(255,255,255,0.22)',
              boxShadow:
                isUnlocked && !isRead ? '0 0 10px rgba(244,218,138,0.72)' : 'none',
            }}
          />
          {isUnlocked ? (isRead ? 'reviver' : 'abrir') : 'bloqueado'}
        </span>
        <span style={styles.ReleaseDate}>liberação · {releaseDate}</span>
      </span>
    </button>
  )
}

export const ProgressConstellation = ({
  moments,
  now,
  onSelect,
  readMoments,
}: ProgressConstellationProps) => (
  <div style={styles.Grid}>
    {moments.map((moment) => (
      <ProgressNode
        chapter={moment.chapter}
        id={moment.id}
        isRead={readMoments.has(moment.id)}
        isUnlocked={isMomentUnlocked(moment, now)}
        key={moment.id}
        onSelect={onSelect}
        releaseAt={moment.releaseAt}
      />
    ))}
  </div>
)

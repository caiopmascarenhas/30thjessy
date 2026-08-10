import { useEffect } from 'react'

import { Button } from '~/components/Button'
import { Countdown } from '~/components/Countdown'
import { GoldDivider } from '~/components/GoldDivider'
import { MomentArtwork } from '~/components/MomentArtwork'
import { ScreenShell } from '~/components/ScreenShell'
import { Typography } from '~/components/Typography'
import { MOMENTS, TOTAL_MOMENTS } from '~/config'
import { resolveMessage } from '~/content'
import { useEnterAnimation, useReleaseClock, useViewport } from '~/hooks'
import { theme } from '~/theme'
import { isMomentUnlocked } from '~/utils'

import { styles } from './MomentScreen.styles'
import type { MomentScreenProps } from './MomentScreen.types'

export const MomentScreen = ({
  momentId,
  onBack,
  onMarkRead,
  onNavigate,
}: MomentScreenProps) => {
  const now = useReleaseClock(MOMENTS)
  const viewport = useViewport()
  const artworkRef = useEnterAnimation<HTMLDivElement>({ duration: 900, distance: 14 })
  const textRef = useEnterAnimation<HTMLDivElement>({ delay: 130, duration: 920, distance: 24 })

  const moment = MOMENTS.find((item) => item.id === momentId) ?? MOMENTS[0]
  const message = resolveMessage(moment.id)
  const previousMoment = MOMENTS.find((item) => item.id === moment.id - 1)
  const nextMoment = MOMENTS.find((item) => item.id === moment.id + 1)
  const canOpenNext = nextMoment ? isMomentUnlocked(nextMoment, now) : false
  const progress = (moment.id / TOTAL_MOMENTS) * 100
  const isNarrow = viewport.kind !== 'desktop'

  useEffect(() => {
    onMarkRead(moment.id)
  }, [moment.id, onMarkRead])

  return (
    <ScreenShell ambient={moment.ambient}>
      <header style={styles.Header}>
        <button onClick={onBack} style={styles.BackButton} type="button">
          <span aria-hidden="true">←</span>
          mapa dos 30
        </button>

        <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
          <Typography color={theme.colors.muted} variant="caption">
            {String(moment.id).padStart(2, '0')} / 30
          </Typography>
          <div style={styles.ProgressRail}>
            <div
              style={{
                background: 'linear-gradient(90deg, #9A6F27, #F4DA8A)',
                height: '100%',
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </header>

      <div
        style={{
          ...styles.Layout,
          alignItems: isNarrow ? 'start' : styles.Layout.alignItems,
          gridTemplateColumns: isNarrow ? '1fr' : styles.Layout.gridTemplateColumns,
        }}
      >
        <div ref={artworkRef}>
          <MomentArtwork momentId={moment.id} visual={moment.visual} />
        </div>

        <article
          ref={textRef}
          style={{
            ...styles.ContentCard,
            justifyContent: isNarrow ? 'flex-start' : styles.ContentCard.justifyContent,
            minHeight: isNarrow ? 'auto' : styles.ContentCard.minHeight,
            padding: isNarrow ? '0' : styles.ContentCard.padding,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 17 }}>
            <Typography color={theme.colors.goldBright} variant="eyebrow">
              capítulo {String(moment.id).padStart(2, '0')} · {moment.chapter}
            </Typography>
            <Typography as="h1" variant="h1">
              {moment.chapter}.
            </Typography>
          </div>

          <GoldDivider />

          <Typography
            color={theme.colors.champagne}
            style={{ fontSize: 'clamp(18px, 2vw, 23px)', lineHeight: 1.68, maxWidth: 640, whiteSpace: 'pre-line' }}
          >
            {message.text}
          </Typography>

          {import.meta.env.DEV && message.source === 'mock' ? (
            <Typography color={theme.colors.muted} variant="caption">
              DEV · exibindo texto mock. Preencha src/content/messages.official.json para substituir.
            </Typography>
          ) : null}

          <div
            style={{
              ...styles.Footer,
              alignItems: isNarrow ? 'stretch' : 'center',
              flexDirection: isNarrow ? 'column' : 'row',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', gap: 10 }}>
              {previousMoment ? (
                <Button onClick={() => onNavigate(previousMoment.id)} variant="ghost">
                  <span aria-hidden="true">←</span>
                  anterior
                </Button>
              ) : null}

              {canOpenNext && nextMoment ? (
                <Button onClick={() => onNavigate(nextMoment.id)} variant="outline">
                  próximo
                  <span aria-hidden="true">→</span>
                </Button>
              ) : null}
            </div>

            {!canOpenNext && nextMoment ? (
              <div
                style={{
                  alignItems: isNarrow ? 'flex-start' : 'flex-end',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <Typography color={theme.colors.muted} variant="caption">
                  PRÓXIMO CAPÍTULO EM
                </Typography>
                <Countdown compact targetIso={nextMoment.releaseAt} />
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </ScreenShell>
  )
}

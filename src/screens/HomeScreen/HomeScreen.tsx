import { Countdown } from '~/components/Countdown'
import { GoldDivider } from '~/components/GoldDivider'
import { ProgressConstellation } from '~/components/ProgressConstellation'
import { ScreenShell } from '~/components/ScreenShell'
import { Typography } from '~/components/Typography'
import { BIRTHDAY_CONFIG, MOMENTS, TOTAL_MOMENTS } from '~/config'
import { useEnterAnimation, useNow, useViewport } from '~/hooks'
import { theme } from '~/theme'
import { getNextLockedMoment, getUnlockedMoments } from '~/utils'

import { styles } from './HomeScreen.styles'
import type { HomeScreenProps } from './HomeScreen.types'

export const HomeScreen = ({ onSelectMoment, readMoments }: HomeScreenProps) => {
  const now = useNow()
  const viewport = useViewport()
  const introRef = useEnterAnimation<HTMLDivElement>({ duration: 850 })
  const mapRef = useEnterAnimation<HTMLDivElement>({ delay: 120, duration: 850 })

  const unlockedMoments = getUnlockedMoments(MOMENTS, now)
  const nextMoment = getNextLockedMoment(MOMENTS, now)
  const unlockedCount = unlockedMoments.length
  const progress = (unlockedCount / TOTAL_MOMENTS) * 100
  const isNarrow = viewport.kind !== 'desktop'

  return (
    <ScreenShell ambient="stars">
      <header
        style={{
          ...styles.Header,
          alignItems: isNarrow ? 'flex-start' : 'flex-end',
          flexDirection: isNarrow ? 'column' : 'row',
        }}
      >
        <div ref={introRef} style={styles.Intro}>
          <Typography color={theme.colors.goldBright} variant="eyebrow">
            10 → 14 de agosto · {BIRTHDAY_CONFIG.timezoneLabel}
          </Typography>
          <Typography as="h1" variant="h1">
            30 anos.
            <br />
            30 pequenos capítulos.
          </Typography>
          <Typography color={theme.colors.mutedStrong} style={{ maxWidth: 680 }}>
            Um mapa para ser aberto devagar. Algumas partes já estão esperando por você;
            outras ainda precisam de um pouco de tempo.
          </Typography>
        </div>

        <div
          style={{
            alignItems: isNarrow ? 'flex-start' : 'flex-end',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Typography color={theme.colors.muted} variant="caption">
            LIBERADOS AGORA
          </Typography>
          <Typography as="span" style={{ lineHeight: 0.9 }} variant="h2">
            {String(unlockedCount).padStart(2, '0')}
            <span
              style={{
                color: theme.colors.goldMuted,
                fontFamily: theme.fonts.body,
                fontSize: 14,
                letterSpacing: '0.04em',
                marginLeft: 8,
              }}
            >
              / 30
            </span>
          </Typography>
        </div>
      </header>

      <div
        style={{
          ...styles.MainGrid,
          gridTemplateColumns: isNarrow ? '1fr' : styles.MainGrid.gridTemplateColumns,
        }}
      >
        <section aria-label="Mapa dos 30 momentos" ref={mapRef}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ alignItems: 'center', display: 'flex', gap: 14 }}>
              <Typography color={theme.colors.champagne} variant="label">
                O mapa dos 30
              </Typography>
              <GoldDivider />
            </div>
            <ProgressConstellation
              moments={MOMENTS}
              now={now}
              onSelect={onSelectMoment}
              readMoments={readMoments}
            />
          </div>
        </section>

        <aside
          style={{
            ...styles.SideColumn,
            position: isNarrow ? 'static' : 'sticky',
          }}
        >
          <div style={styles.AsideCard}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Typography color={theme.colors.goldBright} variant="eyebrow">
                Progresso de liberação
              </Typography>
              <Typography as="h2" variant="h2">
                {Math.round(progress)}%
              </Typography>
            </div>
            <div style={styles.ProgressBar}>
              <div style={{ ...styles.ProgressFill, width: `${progress}%` }} />
            </div>
            <Typography color={theme.colors.muted} variant="caption">
              {readMoments.size} {readMoments.size === 1 ? 'capítulo revisitado' : 'capítulos revisitados'} neste navegador.
            </Typography>
          </div>

          <div style={styles.AsideCard}>
            {nextMoment ? (
              <>
                <Typography color={theme.colors.goldBright} variant="eyebrow">
                  Próxima abertura · #{String(nextMoment.id).padStart(2, '0')}
                </Typography>
                <Typography as="h3" variant="h2">
                  {nextMoment.chapter}
                </Typography>
                <Countdown compact now={now} targetIso={nextMoment.releaseAt} />
                <Typography color={theme.colors.muted} variant="caption">
                  O último capítulo, o número 30, só abre à meia-noite do dia 14.
                </Typography>
              </>
            ) : (
              <>
                <Typography color={theme.colors.goldBright} variant="eyebrow">
                  Tudo aberto
                </Typography>
                <Typography as="h3" variant="h2">
                  Os 30 são seus.
                </Typography>
                <Typography color={theme.colors.mutedStrong}>
                  Agora não existe mais cadeado. Só histórias para abrir de novo quando quiser.
                </Typography>
              </>
            )}
          </div>

          <Typography color={theme.colors.muted} style={{ padding: '0 4px' }} variant="caption">
            A disponibilidade é calculada pelo relógio deste dispositivo, considerando os horários definidos para Brasília.
          </Typography>
        </aside>
      </div>
    </ScreenShell>
  )
}

import { type FormEvent, useEffect, useState } from 'react'

import { Button } from '~/components/Button'
import { GoldDivider } from '~/components/GoldDivider'
import { MomentArtwork } from '~/components/MomentArtwork'
import { ScreenShell } from '~/components/ScreenShell'
import { Typography } from '~/components/Typography'
import { BIRTHDAY_CONFIG, MOMENTS } from '~/config'
import { resolveMessage } from '~/content'
import { useEnterAnimation, useViewport } from '~/hooks'
import { theme } from '~/theme'
import { openWhatsAppWish } from '~/utils'

import { styles } from './FinaleScreen.styles'
import type { FinaleScreenProps } from './FinaleScreen.types'

const FINAL_MOMENT_ID = 30

export const FinaleScreen = ({ onBack, onMarkRead }: FinaleScreenProps) => {
  const [giftWish, setGiftWish] = useState('')
  const [error, setError] = useState('')
  const viewport = useViewport()
  const artworkRef = useEnterAnimation<HTMLDivElement>({ duration: 1050, distance: 18 })
  const contentRef = useEnterAnimation<HTMLDivElement>({ delay: 180, duration: 980, distance: 26 })
  const finalMoment = MOMENTS.find((moment) => moment.id === FINAL_MOMENT_ID) ?? MOMENTS[29]
  const message = resolveMessage(FINAL_MOMENT_ID)
  const isNarrow = viewport.kind !== 'desktop'

  useEffect(() => {
    onMarkRead(FINAL_MOMENT_ID)
  }, [onMarkRead])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    try {
      openWhatsAppWish(BIRTHDAY_CONFIG.whatsappNumber, giftWish)
    } catch (submitError) {
      console.error('[finale] Não foi possível enviar o desejo.', submitError)
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Não foi possível abrir o WhatsApp agora.',
      )
    }
  }

  return (
    <ScreenShell ambient="rays">
      <header style={styles.Header}>
        <button onClick={onBack} style={styles.BackButton} type="button">
          <span aria-hidden="true">←</span>
          mapa dos 30
        </button>
        <Typography color={theme.colors.goldBright} variant="eyebrow">
          14 de agosto · capítulo final
        </Typography>
      </header>

      <div
        style={{
          ...styles.Layout,
          gridTemplateColumns: isNarrow ? '1fr' : styles.Layout.gridTemplateColumns,
        }}
      >
        <div ref={artworkRef}>
          <MomentArtwork momentId={FINAL_MOMENT_ID} visual={finalMoment.visual} />
        </div>

        <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Typography color={theme.colors.goldBright} variant="eyebrow">
              chegou o dia
            </Typography>
            <Typography as="h1" variant="h1">
              Feliz 30.
            </Typography>
            <GoldDivider />
            <Typography
              color={theme.colors.champagne}
              style={{ fontSize: 'clamp(18px, 2vw, 23px)', lineHeight: 1.7, whiteSpace: 'pre-line' }}
            >
              {message.text}
            </Typography>
            {import.meta.env.DEV && message.source === 'mock' ? (
              <Typography color={theme.colors.muted} variant="caption">
                DEV · texto mock ativo. O oficial substitui este automaticamente quando preenchido.
              </Typography>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} style={styles.GiftCard}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Typography color={theme.colors.goldBright} variant="eyebrow">
                um último detalhe
              </Typography>
              <Typography as="h2" variant="h2">
                Agora faz um desejo.
              </Typography>
              <Typography color={theme.colors.mutedStrong}>
                Pode ser um presente, uma experiência, algo simples ou completamente exagerado.
                Escreve aqui — a resposta vai direto para o WhatsApp.
              </Typography>
            </div>

            <label htmlFor="gift-wish">
              <Typography color={theme.colors.muted} variant="label">
                Seu desejo de presente
              </Typography>
            </label>
            <textarea
              aria-describedby={error ? 'gift-error' : undefined}
              aria-invalid={Boolean(error)}
              id="gift-wish"
              maxLength={600}
              onChange={(event) => {
                setGiftWish(event.target.value)
                setError('')
              }}
              placeholder="Eu queria…"
              style={{
                ...styles.Textarea,
                borderColor: error ? theme.colors.danger : 'rgba(215,180,96,0.22)',
              }}
              value={giftWish}
            />

            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                gap: 16,
                justifyContent: 'space-between',
              }}
            >
              <Typography color={error ? theme.colors.danger : theme.colors.muted} variant="caption">
                {error || `${giftWish.length}/600`}
              </Typography>
              <Button disabled={!giftWish.trim()} type="submit">
                Enviar meu desejo
                <span aria-hidden="true">↗</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ScreenShell>
  )
}

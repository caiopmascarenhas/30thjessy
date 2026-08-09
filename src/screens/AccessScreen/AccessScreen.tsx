import { type FormEvent, useState } from 'react'

import { Button } from '~/components/Button'
import { GoldDivider } from '~/components/GoldDivider'
import { ScreenShell } from '~/components/ScreenShell'
import { Typography } from '~/components/Typography'
import { BIRTHDAY_CONFIG } from '~/config'
import { useEnterAnimation, useViewport } from '~/hooks'
import { musicService } from '~/music'
import { theme } from '~/theme'
import { sha256 } from '~/utils'

import { styles } from './AccessScreen.styles'
import type { AccessScreenProps } from './AccessScreen.types'

export const AccessScreen = ({ onAuthenticated }: AccessScreenProps) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const viewport = useViewport()
  const cardRef = useEnterAnimation<HTMLDivElement>({ delay: 160, distance: 20 })
  const numberRef = useEnterAnimation<HTMLDivElement>({ duration: 1000, distance: 28 })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (password.length !== 6) {
      setError('A senha tem 6 números.')
      return
    }

    setLoading(true)
    musicService.prime()

    try {
      const passwordHash = await sha256(password)

      if (passwordHash !== BIRTHDAY_CONFIG.passwordSha256) {
        setError('Essa não é a combinação. Tenta de novo ✨')
        setPassword('')
        return
      }

      onAuthenticated()
    } catch (submitError) {
      console.error('[access] Falha ao acessar a experiência.', submitError)
      setError('Não consegui validar agora. Atualize a página e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const isMobile = viewport.kind === 'mobile'
  const isTablet = viewport.kind === 'tablet'

  return (
    <ScreenShell ambient="rays">
      <div
        style={{
          ...styles.Layout,
          gridTemplateColumns: isMobile || isTablet ? '1fr' : styles.Layout.gridTemplateColumns,
          paddingTop: isMobile ? 8 : 0,
        }}
      >
        <div
          ref={numberRef}
          style={{
            ...styles.NumberWrap,
            minHeight: isMobile ? 170 : isTablet ? 240 : 300,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              border: '1px solid rgba(215,180,96,0.13)',
              borderRadius: '50%',
              height: 'clamp(210px, 35vw, 500px)',
              position: 'absolute',
              transform: 'rotate(-11deg) scaleY(0.58)',
              width: 'clamp(210px, 35vw, 500px)',
            }}
          />
          <span style={styles.Number}>30</span>
        </div>

        <div ref={cardRef} style={styles.Card}>
          <span aria-hidden="true" style={styles.TopLine} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Typography color={theme.colors.goldBright} variant="eyebrow">
              Uma experiência para abrir aos poucos
            </Typography>
            <Typography as="h1" variant="h2">
              Antes de tudo, uma senha.
            </Typography>
            <Typography color={theme.colors.mutedStrong}>
              São seis números. Se você chegou até aqui, provavelmente sabe quais são.
            </Typography>
          </div>

          <GoldDivider />

          <form onSubmit={handleSubmit} style={styles.Form}>
            <label htmlFor="birthday-password">
              <Typography color={theme.colors.muted} variant="label">
                Senha de acesso
              </Typography>
            </label>
            <input
              aria-describedby={error ? 'password-error' : undefined}
              aria-invalid={Boolean(error)}
              autoComplete="off"
              autoFocus={!isMobile}
              id="birthday-password"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => {
                setPassword(event.target.value.replace(/\D/g, '').slice(0, 6))
                setError('')
              }}
              pattern="[0-9]*"
              placeholder="••••••"
              style={{
                ...styles.Input,
                borderColor: error ? theme.colors.danger : 'rgba(215,180,96,0.22)',
                boxShadow: error ? '0 0 0 3px rgba(244,166,166,0.08)' : 'none',
              }}
              type="password"
              value={password}
            />

            <div style={{ minHeight: 20 }}>
              {error ? (
                <Typography
                  as="span"
                  color={theme.colors.danger}
                  style={{ display: 'block' }}
                  variant="caption"
                >
                  {error}
                </Typography>
              ) : (
                <Typography as="span" color={theme.colors.muted} variant="caption">
                  Dica: seis números que contam uma história.
                </Typography>
              )}
            </div>

            <Button disabled={loading || password.length !== 6} fullWidth type="submit">
              {loading ? 'Abrindo…' : 'Entrar na experiência'}
              <span aria-hidden="true">→</span>
            </Button>
          </form>
        </div>
      </div>
    </ScreenShell>
  )
}

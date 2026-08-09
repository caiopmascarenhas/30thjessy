import { BIRTHDAY_CONFIG } from '~/config'
import type { MomentConfig } from '~/config'

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
}

export const isPreviewUnlockEnabled = (): boolean => {
  try {
    const searchParams = new URLSearchParams(window.location.search)

    return (
      searchParams.get(BIRTHDAY_CONFIG.previewQueryKey) ===
      BIRTHDAY_CONFIG.previewQueryValue
    )
  } catch (error) {
    console.error('[preview] Não foi possível validar o parâmetro de teste.', error)
    return false
  }
}

export const isMomentUnlocked = (moment: MomentConfig, now: Date): boolean => {
  if (isPreviewUnlockEnabled()) {
    return true
  }

  return now.getTime() >= new Date(moment.releaseAt).getTime()
}

export const getUnlockedMoments = (
  moments: MomentConfig[],
  now: Date,
): MomentConfig[] => moments.filter((moment) => isMomentUnlocked(moment, now))

export const getNextLockedMoment = (
  moments: MomentConfig[],
  now: Date,
): MomentConfig | undefined => moments.find((moment) => !isMomentUnlocked(moment, now))

export const getCountdown = (targetIso: string, now: Date): CountdownParts => {
  const totalMs = Math.max(0, new Date(targetIso).getTime() - now.getTime())
  const totalSeconds = Math.floor(totalMs / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs,
  }
}

export const formatReleaseDate = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      timeZone: 'America/Sao_Paulo',
    })
      .format(new Date(iso))
      .replace('.', '')
  } catch (error) {
    console.error('[date] Não foi possível formatar a data.', error)
    return 'em breve'
  }
}

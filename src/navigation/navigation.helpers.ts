import type { AppRoute } from './navigation.types'

export const parseHashRoute = (hash: string): AppRoute => {
  try {
    const normalizedHash = hash.replace(/^#/, '')
    const momentMatch = normalizedHash.match(/^\/momento\/(\d{1,2})$/)

    if (momentMatch) {
      const momentId = Number(momentMatch[1])

      if (Number.isInteger(momentId) && momentId >= 1 && momentId <= 30) {
        return { momentId, name: 'moment' }
      }
    }

    return { name: 'home' }
  } catch (error) {
    console.error('[navigation] Não foi possível interpretar a rota.', error)
    return { name: 'home' }
  }
}

export const navigateToHome = (): void => {
  try {
    window.location.hash = '/'
  } catch (error) {
    console.error('[navigation] Não foi possível voltar para o início.', error)
  }
}

export const navigateToMoment = (momentId: number): void => {
  try {
    window.location.hash = `/momento/${momentId}`
  } catch (error) {
    console.error('[navigation] Não foi possível abrir o momento.', error)
  }
}

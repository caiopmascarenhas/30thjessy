export const readSessionFlag = (key: string): boolean => {
  try {
    return window.sessionStorage.getItem(key) === '1'
  } catch (error) {
    console.error('[storage] Não foi possível ler a sessão.', error)
    return false
  }
}

export const writeSessionFlag = (key: string, value: boolean): void => {
  try {
    if (value) {
      window.sessionStorage.setItem(key, '1')
      return
    }

    window.sessionStorage.removeItem(key)
  } catch (error) {
    console.error('[storage] Não foi possível atualizar a sessão.', error)
  }
}

export const readNumberSet = (key: string): Set<number> => {
  try {
    const rawValue = window.localStorage.getItem(key)

    if (!rawValue) {
      return new Set<number>()
    }

    const parsedValue = JSON.parse(rawValue) as unknown

    if (!Array.isArray(parsedValue)) {
      return new Set<number>()
    }

    return new Set(
      parsedValue.filter(
        (value): value is number => typeof value === 'number' && Number.isFinite(value),
      ),
    )
  } catch (error) {
    console.error('[storage] Não foi possível ler o progresso.', error)
    return new Set<number>()
  }
}

export const writeNumberSet = (key: string, values: Set<number>): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(values)))
  } catch (error) {
    console.error('[storage] Não foi possível salvar o progresso.', error)
  }
}

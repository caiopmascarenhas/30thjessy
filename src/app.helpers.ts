import { theme } from '~/theme'

export const applyDocumentStyles = (): void => {
  try {
    document.documentElement.style.backgroundColor = theme.colors.background
    document.documentElement.style.colorScheme = 'dark'
    document.documentElement.style.minWidth = '320px'
    document.documentElement.style.overflowX = 'hidden'

    document.body.style.backgroundColor = theme.colors.background
    document.body.style.color = theme.colors.text
    document.body.style.fontFamily = theme.fonts.body
    document.body.style.margin = '0'
    document.body.style.minWidth = '320px'
    document.body.style.minHeight = '100dvh'
    document.body.style.overflowX = 'hidden'

    const root = document.getElementById('root')

    if (root) {
      root.style.minHeight = '100dvh'
      root.style.width = '100%'
    }

    document.title = '30 anos · uma experiência em 30 capítulos'
  } catch (error) {
    console.error('[app] Não foi possível aplicar os estilos globais.', error)
  }
}

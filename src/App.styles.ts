import type { CSSProperties } from 'react'

import { theme } from '~/theme'

export const styles = {
  App: {
    background: theme.colors.background,
    color: theme.colors.text,
    minHeight: '100dvh',
    width: '100%',
  } satisfies CSSProperties,
}

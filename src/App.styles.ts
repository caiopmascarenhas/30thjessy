import type { CSSProperties } from 'react'

import { theme } from '~/theme'

export const styles = {
  App: {
    background: theme.colors.background,
    color: theme.colors.text,
    minHeight: '100svh',
    width: '100%',
  } satisfies CSSProperties,
}

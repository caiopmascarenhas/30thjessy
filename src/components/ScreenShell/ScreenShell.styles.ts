import type { CSSProperties } from 'react'

import { theme } from '~/theme'

export const styles = {
  Content: {
    boxSizing: 'border-box',
    margin: '0 auto',
    minHeight: '100svh',
    padding: 'clamp(22px, 4vw, 56px)',
    position: 'relative',
    width: '100%',
    zIndex: 1,
  } satisfies CSSProperties,
  Root: {
    background: theme.colors.background,
    color: theme.colors.text,
    minHeight: '100svh',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  } satisfies CSSProperties,
  Vignette: {
    background:
      'radial-gradient(circle at center, rgba(0,0,0,0) 36%, rgba(0,0,0,0.36) 100%)',
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 0,
  } satisfies CSSProperties,
}

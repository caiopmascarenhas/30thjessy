import type { CSSProperties } from 'react'

import { theme } from '~/theme'

export const styles = {
  Dot: {
    background: theme.colors.goldBright,
    borderRadius: theme.radii.circle,
    boxShadow: '0 0 14px rgba(244,218,138,0.42)',
    height: 4,
    width: 4,
  } satisfies CSSProperties,
  Line: {
    background:
      'linear-gradient(90deg, rgba(215,180,96,0), rgba(215,180,96,0.7), rgba(215,180,96,0))',
    height: 1,
    maxWidth: 120,
    width: '20vw',
  } satisfies CSSProperties,
  Root: {
    alignItems: 'center',
    display: 'flex',
    gap: 10,
  } satisfies CSSProperties,
}

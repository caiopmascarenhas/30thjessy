import type { CSSProperties } from 'react'

import { theme } from '~/theme'

export const styles = {
  Item: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minWidth: 45,
  } satisfies CSSProperties,
  Label: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  } satisfies CSSProperties,
  Root: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    gap: 'clamp(8px, 2vw, 18px)',
    minHeight: 36,
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,
  Separator: {
    color: theme.colors.goldMuted,
    fontFamily: theme.fonts.display,
    fontSize: 18,
    opacity: 0.72,
    transform: 'translateY(-7px)',
  } satisfies CSSProperties,
  Value: {
    color: theme.colors.champagne,
    fontFamily: theme.fonts.mono,
    fontSize: 18,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    letterSpacing: '-0.03em',
  } satisfies CSSProperties,
}

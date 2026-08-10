import type { CSSProperties } from 'react'

import { theme } from '~/theme'

export const styles = {
  Item: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    gap: 3,
    width: 45,
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
    contain: 'layout style',
    display: 'flex',
    flexWrap: 'nowrap',
    gap: 'clamp(8px, 2vw, 18px)',
    minHeight: 36,
    overflowAnchor: 'none',
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,
  Separator: {
    color: theme.colors.goldMuted,
    flexShrink: 0,
    fontFamily: theme.fonts.display,
    fontSize: 18,
    opacity: 0.72,
    textAlign: 'center',
    transform: 'translateY(-7px)',
    width: 4,
  } satisfies CSSProperties,
  Value: {
    color: theme.colors.champagne,
    display: 'inline-block',
    fontFamily: theme.fonts.mono,
    fontSize: 18,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    letterSpacing: '-0.03em',
    textAlign: 'center',
    width: '2.4ch',
  } satisfies CSSProperties,
}

import type { CSSProperties } from 'react'

import { theme } from '~/theme'

export const styles = {
  Canvas: {
    height: '100%',
    inset: 0,
    position: 'absolute',
    width: '100%',
  } satisfies CSSProperties,

  Container: {
    alignItems: 'center',
    background: theme.colors.background,
    display: 'flex',
    height: '100dvh',
    inset: 0,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'fixed',
    width: '100vw',
    zIndex: 1000,
  } satisfies CSSProperties,

  Copy: {
    alignItems: 'center',
    bottom: 'clamp(44px, 8vh, 82px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    left: 24,
    pointerEvents: 'none',
    position: 'absolute',
    right: 24,
    textAlign: 'center',
    willChange: 'opacity, transform',
  } satisfies CSSProperties,

  Eyebrow: {
    color: theme.colors.goldBright,
    fontFamily: theme.fonts.body,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.3em',
    margin: 0,
    textTransform: 'uppercase',
  } satisfies CSSProperties,

  Title: {
    color: theme.colors.champagne,
    fontFamily: theme.fonts.display,
    fontSize: 'clamp(32px, 5.8vw, 68px)',
    fontWeight: 400,
    letterSpacing: '-0.03em',
    lineHeight: 1.02,
    margin: 0,
  } satisfies CSSProperties,
}

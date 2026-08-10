import type { CSSProperties } from 'react'

import { theme } from '~/theme'

export const styles = {
  Card: {
    background:
      'linear-gradient(145deg, rgba(21,19,14,0.88), rgba(8,8,6,0.88))',
    border: `1px solid ${theme.colors.line}`,
    borderRadius: 'clamp(24px, 4vw, 42px)',
    boxShadow: theme.shadows.strong,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    maxWidth: 560,
    padding: 'clamp(28px, 5vw, 54px)',
    position: 'relative',
    width: '100%',
  } satisfies CSSProperties,
  Form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    width: '100%',
  } satisfies CSSProperties,
  Input: {
    background: 'rgba(255,255,255,0.028)',
    border: '1px solid rgba(215,180,96,0.22)',
    borderRadius: 18,
    boxSizing: 'border-box',
    color: theme.colors.champagne,
    fontFamily: theme.fonts.mono,
    fontSize: 'clamp(24px, 6vw, 34px)',
    fontWeight: 500,
    height: 68,
    letterSpacing: '0.48em',
    outline: 'none',
    padding: '0 16px 0 32px',
    textAlign: 'center',
    width: '100%',
  } satisfies CSSProperties,
  Layout: {
    alignItems: 'center',
    display: 'grid',
    gap: 'clamp(28px, 7vw, 110px)',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 560px)',
    minHeight: 'calc(100svh - clamp(44px, 8vw, 112px))',
    width: '100%',
  } satisfies CSSProperties,
  Number: {
    color: theme.colors.champagne,
    fontFamily: theme.fonts.display,
    fontSize: 'clamp(160px, 31vw, 470px)',
    fontWeight: 400,
    letterSpacing: '-0.11em',
    lineHeight: 0.7,
    marginLeft: '-0.07em',
    opacity: 0.96,
    textShadow: '0 20px 80px rgba(215,180,96,0.16)',
    userSelect: 'none',
  } satisfies CSSProperties,
  NumberWrap: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    minHeight: 300,
    position: 'relative',
  } satisfies CSSProperties,
  TopLine: {
    background:
      'linear-gradient(90deg, rgba(244,218,138,0), rgba(244,218,138,0.7), rgba(244,218,138,0))',
    height: 1,
    left: '12%',
    position: 'absolute',
    right: '12%',
    top: 0,
  } satisfies CSSProperties,
}

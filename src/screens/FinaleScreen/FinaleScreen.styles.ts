import type { CSSProperties } from 'react'

import { theme } from '~/theme'

export const styles = {
  BackButton: {
    alignItems: 'center',
    appearance: 'none',
    background: 'transparent',
    border: 0,
    color: theme.colors.mutedStrong,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: theme.fonts.body,
    fontSize: 12,
    fontWeight: 650,
    gap: 9,
    letterSpacing: '0.05em',
    padding: '10px 0',
  } satisfies CSSProperties,
  GiftCard: {
    background:
      'linear-gradient(145deg, rgba(28,24,16,0.82), rgba(10,9,7,0.84))',
    border: '1px solid rgba(244,218,138,0.23)',
    borderRadius: 28,
    boxShadow: theme.shadows.goldGlow,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    padding: 'clamp(22px, 4vw, 34px)',
    width: '100%',
  } satisfies CSSProperties,
  Header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 'clamp(28px, 5vw, 56px)',
  } satisfies CSSProperties,
  Layout: {
    alignItems: 'center',
    display: 'grid',
    gap: 'clamp(36px, 7vw, 92px)',
    gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(360px, 0.9fr)',
    margin: '0 auto',
    maxWidth: 1260,
  } satisfies CSSProperties,
  Textarea: {
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(215,180,96,0.22)',
    borderRadius: 18,
    boxSizing: 'border-box',
    color: theme.colors.text,
    fontFamily: theme.fonts.body,
    fontSize: 16,
    lineHeight: 1.55,
    minHeight: 126,
    outline: 'none',
    padding: 16,
    resize: 'vertical',
    width: '100%',
  } satisfies CSSProperties,
}

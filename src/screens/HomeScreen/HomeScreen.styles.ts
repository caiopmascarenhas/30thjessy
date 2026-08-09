import type { CSSProperties } from 'react'

import { theme } from '~/theme'

export const styles = {
  AsideCard: {
    background:
      'linear-gradient(145deg, rgba(24,21,15,0.74), rgba(10,9,7,0.7))',
    border: `1px solid ${theme.colors.line}`,
    borderRadius: 26,
    boxShadow: theme.shadows.soft,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    padding: 'clamp(20px, 3vw, 30px)',
  } satisfies CSSProperties,
  Header: {
    alignItems: 'flex-end',
    display: 'flex',
    gap: 24,
    justifyContent: 'space-between',
    marginBottom: 'clamp(42px, 7vw, 86px)',
  } satisfies CSSProperties,
  Intro: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    maxWidth: 780,
  } satisfies CSSProperties,
  MainGrid: {
    alignItems: 'start',
    display: 'grid',
    gap: 'clamp(26px, 4vw, 54px)',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 360px)',
  } satisfies CSSProperties,
  ProgressBar: {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: theme.radii.pill,
    height: 5,
    overflow: 'hidden',
    width: '100%',
  } satisfies CSSProperties,
  ProgressFill: {
    background: 'linear-gradient(90deg, #9A6F27, #F4DA8A)',
    borderRadius: theme.radii.pill,
    boxShadow: '0 0 20px rgba(244,218,138,0.22)',
    height: '100%',
  } satisfies CSSProperties,
  SideColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    position: 'sticky',
    top: 30,
  } satisfies CSSProperties,
}

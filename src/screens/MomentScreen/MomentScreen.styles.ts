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
  ContentCard: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(20px, 3.5vw, 34px)',
    justifyContent: 'center',
    minHeight: '100%',
    padding: 'clamp(8px, 2vw, 30px) 0',
  } satisfies CSSProperties,
  Footer: {
    alignItems: 'center',
    borderTop: '1px solid rgba(215,180,96,0.11)',
    display: 'flex',
    gap: 14,
    justifyContent: 'space-between',
    marginTop: 'clamp(28px, 5vw, 60px)',
    paddingTop: 22,
  } satisfies CSSProperties,
  Header: {
    alignItems: 'center',
    display: 'flex',
    gap: 20,
    justifyContent: 'space-between',
    marginBottom: 'clamp(34px, 5vw, 66px)',
  } satisfies CSSProperties,
  Layout: {
    alignItems: 'stretch',
    display: 'grid',
    gap: 'clamp(34px, 6vw, 88px)',
    gridTemplateColumns: 'minmax(330px, 0.95fr) minmax(360px, 0.8fr)',
    margin: '0 auto',
    maxWidth: 1240,
  } satisfies CSSProperties,
  ProgressRail: {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: theme.radii.pill,
    height: 2,
    maxWidth: 180,
    overflow: 'hidden',
    width: '18vw',
  } satisfies CSSProperties,
}

import type { CSSProperties } from 'react'

import { theme } from '~/theme'

export const styles = {
  Grid: {
    display: 'grid',
    gap: 'clamp(8px, 1.2vw, 14px)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 112px), 1fr))',
    width: '100%',
  } satisfies CSSProperties,
  NodeChapter: {
    fontFamily: theme.fonts.body,
    fontSize: 10,
    fontWeight: 650,
    letterSpacing: '0.05em',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,
  NodeNumber: {
    fontFamily: theme.fonts.display,
    fontSize: 'clamp(25px, 3vw, 34px)',
    fontWeight: 400,
    letterSpacing: '-0.05em',
    lineHeight: 1,
  } satisfies CSSProperties,
  NodeRoot: {
    alignItems: 'flex-start',
    appearance: 'none',
    borderRadius: 18,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 13,
    justifyContent: 'space-between',
    minHeight: 112,
    padding: '15px 14px 13px',
    position: 'relative',
    textAlign: 'left',
    width: '100%',
  } satisfies CSSProperties,
  ReleaseDate: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.body,
    fontSize: 8,
    fontWeight: 600,
    letterSpacing: '0.06em',
    lineHeight: 1.2,
    textTransform: 'uppercase',
  } satisfies CSSProperties,
  Status: {
    alignItems: 'center',
    display: 'flex',
    fontFamily: theme.fonts.body,
    fontSize: 9,
    fontWeight: 700,
    gap: 6,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  } satisfies CSSProperties,
  StatusDot: {
    borderRadius: theme.radii.circle,
    height: 5,
    width: 5,
  } satisfies CSSProperties,
}

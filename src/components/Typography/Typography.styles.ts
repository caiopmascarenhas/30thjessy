import type { CSSProperties } from 'react'

import { theme } from '~/theme'

import type { TypographyVariant } from './Typography.types'

const base: CSSProperties = {
  margin: 0,
  textRendering: 'optimizeLegibility',
}

const variantStyles: Record<TypographyVariant, CSSProperties> = {
  body: {
    fontFamily: theme.fonts.body,
    fontSize: 'clamp(16px, 1.45vw, 19px)',
    fontWeight: 400,
    lineHeight: 1.72,
  },
  caption: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.02em',
    lineHeight: 1.5,
  },
  display: {
    fontFamily: theme.fonts.display,
    fontSize: 'clamp(64px, 13vw, 180px)',
    fontWeight: 400,
    letterSpacing: '-0.065em',
    lineHeight: 0.82,
  },
  eyebrow: {
    fontFamily: theme.fonts.body,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.2em',
    lineHeight: 1.4,
    textTransform: 'uppercase',
  },
  h1: {
    fontFamily: theme.fonts.display,
    fontSize: 'clamp(42px, 7vw, 88px)',
    fontWeight: 400,
    letterSpacing: '-0.045em',
    lineHeight: 0.98,
  },
  h2: {
    fontFamily: theme.fonts.display,
    fontSize: 'clamp(30px, 4.2vw, 52px)',
    fontWeight: 400,
    letterSpacing: '-0.03em',
    lineHeight: 1.04,
  },
  label: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    fontWeight: 650,
    letterSpacing: '0.04em',
    lineHeight: 1.4,
  },
}

export const getTypographyStyle = (
  variant: TypographyVariant,
): CSSProperties => ({
  ...base,
  ...variantStyles[variant],
})

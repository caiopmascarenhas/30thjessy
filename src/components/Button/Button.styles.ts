import type { CSSProperties } from 'react'

import { theme } from '~/theme'

import type { ButtonVariant } from './Button.types'

export const getButtonStyle = ({
  disabled,
  focused,
  fullWidth,
  hovered,
  variant,
}: {
  disabled: boolean
  focused: boolean
  fullWidth: boolean
  hovered: boolean
  variant: ButtonVariant
}): CSSProperties => {
  const variants: Record<ButtonVariant, CSSProperties> = {
    ghost: {
      background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
      border: '1px solid rgba(255,255,255,0.1)',
      color: theme.colors.text,
    },
    gold: {
      background: hovered
        ? 'linear-gradient(135deg, #F4DA8A 0%, #C99638 100%)'
        : 'linear-gradient(135deg, #E6C56F 0%, #B7832E 100%)',
      border: '1px solid rgba(255,255,255,0.16)',
      color: theme.colors.black,
      boxShadow: hovered
        ? '0 18px 42px rgba(183, 131, 46, 0.28)'
        : '0 12px 32px rgba(183, 131, 46, 0.18)',
    },
    outline: {
      background: hovered ? 'rgba(215, 180, 96, 0.08)' : 'transparent',
      border: `1px solid ${hovered ? theme.colors.goldBright : theme.colors.line}`,
      color: theme.colors.champagne,
    },
  }

  return {
    alignItems: 'center',
    borderRadius: theme.radii.pill,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    fontFamily: theme.fonts.body,
    fontSize: 14,
    fontWeight: 700,
    gap: 10,
    justifyContent: 'center',
    letterSpacing: '0.025em',
    minHeight: 52,
    opacity: disabled ? 0.48 : 1,
    outline: focused ? `2px solid ${theme.colors.goldBright}` : 'none',
    outlineOffset: 3,
    padding: '0 22px',
    transform: hovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
    transition:
      'background 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
    width: fullWidth ? '100%' : 'auto',
    ...variants[variant],
  }
}

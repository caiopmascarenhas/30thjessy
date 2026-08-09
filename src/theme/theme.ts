import type { Theme } from './theme.types'

export const theme: Theme = {
  colors: {
    background: '#070706',
    backgroundElevated: '#0D0C0A',
    black: '#050504',
    champagne: '#F4E7C7',
    danger: '#F4A6A6',
    gold: '#D7B460',
    goldBright: '#F4DA8A',
    goldDeep: '#805E22',
    goldMuted: '#A88947',
    line: 'rgba(215, 180, 96, 0.22)',
    muted: '#9D9586',
    mutedStrong: '#C6BCA9',
    surface: '#11100D',
    surfaceGlass: 'rgba(18, 16, 12, 0.76)',
    text: '#FBF7EE',
    white: '#FFFFFF',
  },
  fonts: {
    body:
      'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'Georgia, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  radii: {
    circle: 999,
    large: 32,
    medium: 20,
    pill: 999,
    small: 12,
  },
  shadows: {
    goldGlow:
      '0 0 0 1px rgba(244, 218, 138, 0.18), 0 20px 70px rgba(128, 94, 34, 0.18)',
    soft: '0 18px 45px rgba(0, 0, 0, 0.24)',
    strong: '0 32px 100px rgba(0, 0, 0, 0.48)',
  },
}

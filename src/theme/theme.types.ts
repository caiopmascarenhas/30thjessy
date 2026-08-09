export interface ThemeColors {
  background: string
  backgroundElevated: string
  black: string
  champagne: string
  danger: string
  gold: string
  goldBright: string
  goldDeep: string
  goldMuted: string
  line: string
  muted: string
  mutedStrong: string
  surface: string
  surfaceGlass: string
  text: string
  white: string
}

export interface ThemeFonts {
  body: string
  display: string
  mono: string
}

export interface ThemeRadii {
  circle: number
  large: number
  medium: number
  pill: number
  small: number
}

export interface ThemeShadows {
  goldGlow: string
  soft: string
  strong: string
}

export interface Theme {
  colors: ThemeColors
  fonts: ThemeFonts
  radii: ThemeRadii
  shadows: ThemeShadows
}

import type { CSSProperties, ElementType, ReactNode } from 'react'

export type TypographyVariant =
  | 'body'
  | 'caption'
  | 'display'
  | 'eyebrow'
  | 'h1'
  | 'h2'
  | 'label'

export interface TypographyProps {
  align?: CSSProperties['textAlign']
  as?: ElementType
  children: ReactNode
  color?: string
  style?: CSSProperties
  variant?: TypographyVariant
}

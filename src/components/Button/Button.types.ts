import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'ghost' | 'gold' | 'outline'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
  variant?: ButtonVariant
}

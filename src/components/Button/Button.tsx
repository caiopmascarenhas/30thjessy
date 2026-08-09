import { useState } from 'react'

import { getButtonStyle } from './Button.styles'
import type { ButtonProps } from './Button.types'

export const Button = ({
  children,
  disabled = false,
  fullWidth = false,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  style,
  variant = 'gold',
  ...props
}: ButtonProps) => {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  return (
    <button
      {...props}
      disabled={disabled}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onMouseEnter={(event) => {
        setHovered(true)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        setHovered(false)
        onMouseLeave?.(event)
      }}
      style={{
        ...getButtonStyle({ disabled, focused, fullWidth, hovered, variant }),
        ...style,
      }}
    >
      {children}
    </button>
  )
}

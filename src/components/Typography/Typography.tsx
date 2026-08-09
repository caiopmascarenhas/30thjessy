import { theme } from '~/theme'

import { getTypographyStyle } from './Typography.styles'
import type { TypographyProps } from './Typography.types'

export const Typography = ({
  align,
  as: Component = 'p',
  children,
  color = theme.colors.text,
  style,
  variant = 'body',
}: TypographyProps) => (
  <Component
    style={{
      ...getTypographyStyle(variant),
      color,
      textAlign: align,
      ...style,
    }}
  >
    {children}
  </Component>
)

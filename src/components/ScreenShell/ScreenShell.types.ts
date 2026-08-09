import type { ReactNode } from 'react'

import type { AmbientVariant } from '~/config'

export interface ScreenShellProps {
  ambient?: AmbientVariant
  children: ReactNode
  contentMaxWidth?: number
}

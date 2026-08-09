import { AmbientCanvas } from '~/components/AmbientCanvas'

import { styles } from './ScreenShell.styles'
import type { ScreenShellProps } from './ScreenShell.types'

export const ScreenShell = ({
  ambient = 'stars',
  children,
  contentMaxWidth = 1440,
}: ScreenShellProps) => (
  <main style={styles.Root}>
    <AmbientCanvas variant={ambient} />
    <div aria-hidden="true" style={styles.Vignette} />
    <div style={{ ...styles.Content, maxWidth: contentMaxWidth }}>{children}</div>
  </main>
)

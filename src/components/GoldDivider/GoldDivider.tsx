import { styles } from './GoldDivider.styles'

export const GoldDivider = () => (
  <div aria-hidden="true" style={styles.Root}>
    <span style={styles.Line} />
    <span style={styles.Dot} />
    <span style={styles.Line} />
  </div>
)

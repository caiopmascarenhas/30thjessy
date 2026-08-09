import { getCountdown } from '~/utils'

import { styles } from './Countdown.styles'
import type { CountdownProps } from './Countdown.types'

export const Countdown = ({ compact = false, now, targetIso }: CountdownProps) => {
  const countdown = getCountdown(targetIso, now)
  const values = [
    { label: 'dias', value: countdown.days },
    { label: 'horas', value: countdown.hours },
    { label: 'min', value: countdown.minutes },
    { label: 'seg', value: countdown.seconds },
  ]

  if (compact && countdown.days === 0) {
    values.shift()
  }

  return (
    <div aria-label="Tempo restante" style={styles.Root}>
      {values.map((item, index) => (
        <div key={item.label} style={{ display: 'contents' }}>
          {index > 0 ? <span style={styles.Separator}>·</span> : null}
          <span style={styles.Item}>
            <span style={styles.Value}>{String(item.value).padStart(2, '0')}</span>
            <span style={styles.Label}>{item.label}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

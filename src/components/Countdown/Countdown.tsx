import { useEffect, useMemo, useRef } from 'react'

import { getCountdown } from '~/utils'

import { styles } from './Countdown.styles'
import type { CountdownProps } from './Countdown.types'

type CountdownKey = 'days' | 'hours' | 'minutes' | 'seconds'

const formatValue = (value: number) => String(value).padStart(2, '0')

export const Countdown = ({ compact = false, targetIso }: CountdownProps) => {
  const initialCountdown = useMemo(() => getCountdown(targetIso, new Date()), [targetIso])
  const valueRefs = useRef<Partial<Record<CountdownKey, HTMLSpanElement | null>>>({})
  const showDays = !compact || initialCountdown.days > 0

  useEffect(() => {
    const updateValues = () => {
      const countdown = getCountdown(targetIso, new Date())

      const values: Record<CountdownKey, number> = {
        days: countdown.days,
        hours: countdown.hours,
        minutes: countdown.minutes,
        seconds: countdown.seconds,
      }

      Object.entries(values).forEach(([key, value]) => {
        const element = valueRefs.current[key as CountdownKey]

        if (element) {
          element.textContent = formatValue(value)
        }
      })
    }

    updateValues()
    const interval = window.setInterval(updateValues, 1000)

    return () => window.clearInterval(interval)
  }, [targetIso])

  const renderItem = (key: CountdownKey, label: string, value: number) => (
    <span key={key} style={styles.Item}>
      <span
        ref={(element) => {
          valueRefs.current[key] = element
        }}
        style={styles.Value}
      >
        {formatValue(value)}
      </span>
      <span style={styles.Label}>{label}</span>
    </span>
  )

  return (
    <div aria-label="Tempo restante" style={styles.Root}>
      {showDays ? (
        <>
          {renderItem('days', 'dias', initialCountdown.days)}
          <span style={styles.Separator}>·</span>
        </>
      ) : null}
      {renderItem('hours', 'horas', initialCountdown.hours)}
      <span style={styles.Separator}>·</span>
      {renderItem('minutes', 'min', initialCountdown.minutes)}
      <span style={styles.Separator}>·</span>
      {renderItem('seconds', 'seg', initialCountdown.seconds)}
    </div>
  )
}

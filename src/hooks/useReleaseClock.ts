import { useEffect, useState } from 'react'

interface ReleaseClockItem {
  releaseAt: string
}

const MIN_DELAY_MS = 60
const MAX_DELAY_MS = 2_147_000_000

const getNextReleaseTimestamp = (
  items: readonly ReleaseClockItem[],
  currentTimestamp: number,
): number | null => {
  let nextTimestamp = Number.POSITIVE_INFINITY

  items.forEach((item) => {
    const releaseTimestamp = new Date(item.releaseAt).getTime()

    if (releaseTimestamp > currentTimestamp && releaseTimestamp < nextTimestamp) {
      nextTimestamp = releaseTimestamp
    }
  })

  return Number.isFinite(nextTimestamp) ? nextTimestamp : null
}

export const useReleaseClock = (items: readonly ReleaseClockItem[]): Date => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timeout = 0

    const scheduleNextRelease = () => {
      window.clearTimeout(timeout)

      const currentTimestamp = Date.now()
      const nextTimestamp = getNextReleaseTimestamp(items, currentTimestamp)

      if (nextTimestamp === null) {
        return
      }

      const delay = Math.min(
        MAX_DELAY_MS,
        Math.max(MIN_DELAY_MS, nextTimestamp - currentTimestamp + MIN_DELAY_MS),
      )

      timeout = window.setTimeout(() => {
        setNow(new Date())
        scheduleNextRelease()
      }, delay)
    }

    const refreshClock = () => {
      setNow(new Date())
      scheduleNextRelease()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshClock()
      }
    }

    scheduleNextRelease()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', refreshClock)

    return () => {
      window.clearTimeout(timeout)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', refreshClock)
    }
  }, [items])

  return now
}

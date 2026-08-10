import { useEffect, useState } from 'react'

import { parseHashRoute } from './navigation.helpers'
import type { AppRoute } from './navigation.types'

export const useHashRoute = (): AppRoute => {
  const [route, setRoute] = useState<AppRoute>(() => parseHashRoute(window.location.hash))

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    let frame = 0

    const scrollToTop = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => window.scrollTo(0, 0))
    }

    const handleHashChange = () => {
      setRoute(parseHashRoute(window.location.hash))
      scrollToTop()
    }

    window.history.scrollRestoration = 'manual'
    scrollToTop()
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', handleHashChange)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  return route
}

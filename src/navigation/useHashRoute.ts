import { useEffect, useState } from 'react'

import { parseHashRoute } from './navigation.helpers'
import type { AppRoute } from './navigation.types'

export const useHashRoute = (): AppRoute => {
  const [route, setRoute] = useState<AppRoute>(() => parseHashRoute(window.location.hash))

  useEffect(() => {
    const handleHashChange = () => setRoute(parseHashRoute(window.location.hash))

    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return route
}

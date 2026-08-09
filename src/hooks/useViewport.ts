import { useEffect, useState } from 'react'

export type ViewportKind = 'desktop' | 'mobile' | 'tablet'

export interface ViewportState {
  height: number
  kind: ViewportKind
  width: number
}

const getViewport = (): ViewportState => {
  const width = window.innerWidth
  const height = window.innerHeight

  return {
    height,
    kind: width < 720 ? 'mobile' : width < 1120 ? 'tablet' : 'desktop',
    width,
  }
}

export const useViewport = (): ViewportState => {
  const [viewport, setViewport] = useState<ViewportState>(() => getViewport())

  useEffect(() => {
    let frame = 0

    const handleResize = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => setViewport(getViewport()))
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return viewport
}

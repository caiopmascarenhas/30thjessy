import { useEffect, useRef } from 'react'

import { useReducedMotion } from './useReducedMotion'

interface UseEnterAnimationOptions {
  delay?: number
  distance?: number
  duration?: number
}

export const useEnterAnimation = <T extends HTMLElement>({
  delay = 0,
  distance = 18,
  duration = 720,
}: UseEnterAnimationOptions = {}) => {
  const ref = useRef<T>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current

    if (!element || reducedMotion) {
      return
    }

    try {
      const animation = element.animate(
        [
          { opacity: 0, transform: `translateY(${distance}px) scale(0.985)` },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        {
          delay,
          duration,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
        },
      )

      return () => animation.cancel()
    } catch (error) {
      console.error('[animation] Não foi possível iniciar a animação.', error)
    }
  }, [delay, distance, duration, reducedMotion])

  return ref
}

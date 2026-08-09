import type { CSSProperties } from 'react'

export const styles = {
  Canvas: {
    contain: 'strict',
    height: '100dvh',
    inset: 0,
    pointerEvents: 'none',
    position: 'fixed',
    transform: 'translateZ(0)',
    width: '100vw',
    zIndex: 0,
  } satisfies CSSProperties,
}

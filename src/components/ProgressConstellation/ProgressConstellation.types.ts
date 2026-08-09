import type { MomentConfig } from '~/config'

export interface ProgressConstellationProps {
  moments: MomentConfig[]
  now: Date
  onSelect: (momentId: number) => void
  readMoments: Set<number>
}

export interface MusicLevels {
  air: number
  bass: number
  energy: number
  high: number
  lowMid: number
  mid: number
  presence: number
  subBass: number
  transient: number
}

export interface MusicPlayerState {
  error: string
  isPlaying: boolean
  isReady: boolean
}

export interface MusicVisualFrame {
  deltaMs: number
  isPlaying: boolean
  levels: MusicLevels
  time: number
}

type MusicListener = () => void

export type MusicFrameListener = (frame: MusicVisualFrame) => void
export type MusicStateListener = MusicListener

import { useSyncExternalStore } from 'react'

import { musicService } from './music.service'

export const useMusicPlayer = () =>
  useSyncExternalStore(musicService.subscribe, musicService.getSnapshot, musicService.getSnapshot)

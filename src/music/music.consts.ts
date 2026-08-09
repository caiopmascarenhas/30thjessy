export const MUSIC_SOURCE = `${import.meta.env.BASE_URL}audio/golden-hour-instrumental.mp3`
export const MUSIC_FFT_SIZE = 512

// Mantém os ataques perceptíveis; a suavização visual é feita por frame nos componentes.
export const MUSIC_SMOOTHING = 0.22

export const MUSIC_BANDS = {
  air: [8000, 15000],
  bass: [70, 180],
  high: [4000, 8000],
  lowMid: [180, 520],
  mid: [520, 1800],
  presence: [1800, 4000],
  subBass: [28, 70],
} as const

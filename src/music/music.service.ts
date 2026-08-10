import { MUSIC_BANDS, MUSIC_FFT_SIZE, MUSIC_SMOOTHING, MUSIC_SOURCE } from './music.consts'
import { averageFrequencyBand, calculateTimeDomainEnergy, clamp01 } from './music.helpers'
import type {
  MusicFrameListener,
  MusicLevels,
  MusicPlayerState,
  MusicStateListener,
  MusicVisualFrame,
} from './music.types'

interface WebkitAudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext
}

const ANALYSIS_INTERVAL_MS = 30

const createEmptyLevels = (): MusicLevels => ({
  air: 0,
  bass: 0,
  energy: 0,
  high: 0,
  lowMid: 0,
  mid: 0,
  presence: 0,
  subBass: 0,
  transient: 0,
})

const shapeBand = (value: number, gain: number, exponent: number) =>
  clamp01(Math.pow(value * gain, exponent))

const approach = (
  current: number,
  target: number,
  deltaMs: number,
  attackMs: number,
  releaseMs: number,
): number => {
  const duration = target > current ? attackMs : releaseMs
  const factor = 1 - Math.exp(-deltaMs / Math.max(1, duration))

  return current + (target - current) * factor
}

class MusicService {
  private analyser: AnalyserNode | null = null
  private audio: HTMLAudioElement | null = null
  private audioContext: AudioContext | null = null
  private frequencyData: Uint8Array<ArrayBuffer> | null = null
  private previousFrequencyData: Uint8Array<ArrayBuffer> | null = null
  private frameListeners = new Set<MusicFrameListener>()
  private frameRequest = 0
  private lastAnalysisAt = 0
  private lastFrameAt = 0
  private listeners = new Set<MusicStateListener>()
  private playPromise: Promise<void> | null = null
  private sourceNode: MediaElementAudioSourceNode | null = null
  private state: MusicPlayerState = {
    error: '',
    isPlaying: false,
    isReady: false,
  }
  private targetLevels: MusicLevels = createEmptyLevels()
  private timeDomainData: Uint8Array<ArrayBuffer> | null = null
  private visualClockContextTime = 0
  private visualClockMediaTime = 0
  private visualLevels: MusicLevels = createEmptyLevels()

  public getSnapshot = (): MusicPlayerState => this.state

  public subscribe = (listener: MusicStateListener): (() => void) => {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  public subscribeFrame = (listener: MusicFrameListener): (() => void) => {
    this.frameListeners.add(listener)
    this.ensureFrameLoop()

    return () => {
      this.frameListeners.delete(listener)

      if (this.frameListeners.size === 0 && this.frameRequest) {
        window.cancelAnimationFrame(this.frameRequest)
        this.frameRequest = 0
        this.lastFrameAt = 0
      }
    }
  }

  public getCurrentTime = (): number => this.audio?.currentTime ?? 0

  public getLevels = (): MusicLevels => this.visualLevels

  public getVisualTime = (): number => {
    const audio = this.audio
    const audioContext = this.audioContext

    if (!audio || !audioContext) {
      return 0
    }

    if (!this.state.isPlaying || audioContext.state !== 'running') {
      return audio.currentTime
    }

    let predicted =
      this.visualClockMediaTime + (audioContext.currentTime - this.visualClockContextTime)
    const mediaTime = audio.currentTime

    if (Math.abs(mediaTime - predicted) > 0.45) {
      this.rebaseVisualClock()
      predicted =
        this.visualClockMediaTime + (audioContext.currentTime - this.visualClockContextTime)
    }

    const duration = Number.isFinite(audio.duration) ? audio.duration : 0

    if (duration > 0 && predicted >= duration) {
      return predicted % duration
    }

    return Math.max(0, predicted)
  }

  public prime = (): void => {
    try {
      this.ensureAudioGraph()

      if (this.audioContext?.state === 'suspended') {
        void this.audioContext.resume().catch((error: unknown) => {
          console.warn('[music] O navegador ainda não liberou o AudioContext.', error)
        })
      }
    } catch (error) {
      console.error('[music] Não foi possível preparar o áudio.', error)
    }
  }

  public play = async (): Promise<void> => {
    if (this.state.isPlaying) {
      return
    }

    if (this.playPromise) {
      return this.playPromise
    }

    this.playPromise = this.startPlayback()

    try {
      await this.playPromise
    } finally {
      this.playPromise = null
    }
  }

  public pause = (): void => {
    try {
      this.audio?.pause()
      this.rebaseVisualClock()
      this.targetLevels = createEmptyLevels()
      this.setState({ error: '', isPlaying: false, isReady: this.state.isReady })
    } catch (error) {
      console.error('[music] Falha ao pausar a música.', error)
    }
  }

  public toggle = async (): Promise<void> => {
    if (this.state.isPlaying) {
      this.pause()
      return
    }

    await this.play()
  }

  private analyseAudio = (now: number): void => {
    if (
      !this.state.isPlaying ||
      !this.analyser ||
      !this.audioContext ||
      !this.frequencyData ||
      !this.previousFrequencyData ||
      !this.timeDomainData
    ) {
      this.targetLevels = createEmptyLevels()
      return
    }

    if (now - this.lastAnalysisAt < ANALYSIS_INTERVAL_MS) {
      return
    }

    try {
      this.analyser.getByteFrequencyData(this.frequencyData)
      this.analyser.getByteTimeDomainData(this.timeDomainData)

      const sampleRate = this.audioContext.sampleRate
      const subBass = averageFrequencyBand(
        this.frequencyData,
        sampleRate,
        MUSIC_BANDS.subBass[0],
        MUSIC_BANDS.subBass[1],
      )
      const bass = averageFrequencyBand(
        this.frequencyData,
        sampleRate,
        MUSIC_BANDS.bass[0],
        MUSIC_BANDS.bass[1],
      )
      const lowMid = averageFrequencyBand(
        this.frequencyData,
        sampleRate,
        MUSIC_BANDS.lowMid[0],
        MUSIC_BANDS.lowMid[1],
      )
      const mid = averageFrequencyBand(
        this.frequencyData,
        sampleRate,
        MUSIC_BANDS.mid[0],
        MUSIC_BANDS.mid[1],
      )
      const presence = averageFrequencyBand(
        this.frequencyData,
        sampleRate,
        MUSIC_BANDS.presence[0],
        MUSIC_BANDS.presence[1],
      )
      const high = averageFrequencyBand(
        this.frequencyData,
        sampleRate,
        MUSIC_BANDS.high[0],
        MUSIC_BANDS.high[1],
      )
      const air = averageFrequencyBand(
        this.frequencyData,
        sampleRate,
        MUSIC_BANDS.air[0],
        MUSIC_BANDS.air[1],
      )

      let positiveFlux = 0
      let activeBins = 0

      for (let index = 0; index < this.frequencyData.length; index += 1) {
        const current = this.frequencyData[index] ?? 0
        const previous = this.previousFrequencyData[index] ?? current
        const delta = current - previous

        if (delta > 0) {
          positiveFlux += delta
        }

        this.previousFrequencyData[index] = current
        activeBins += 1
      }

      const transient = clamp01((positiveFlux / Math.max(1, activeBins) / 255) * 6)
      const energy = calculateTimeDomainEnergy(this.timeDomainData)

      this.targetLevels = {
        air: shapeBand(air, 3.15, 0.7),
        bass: shapeBand(bass, 2.5, 0.72),
        energy: shapeBand(energy, 1.32, 0.84),
        high: shapeBand(high, 2.85, 0.72),
        lowMid: shapeBand(lowMid, 2.25, 0.74),
        mid: shapeBand(mid, 2.3, 0.73),
        presence: shapeBand(presence, 2.55, 0.72),
        subBass: shapeBand(subBass, 2.7, 0.72),
        transient,
      }
      this.lastAnalysisAt = now
    } catch (error) {
      console.error('[music] Não foi possível analisar a música.', error)
      this.targetLevels = createEmptyLevels()
    }
  }

  private smoothVisualLevels = (deltaMs: number): void => {
    const target = this.targetLevels
    const current = this.visualLevels

    current.subBass = approach(current.subBass, target.subBass, deltaMs, 28, 180)
    current.bass = approach(current.bass, target.bass, deltaMs, 26, 165)
    current.lowMid = approach(current.lowMid, target.lowMid, deltaMs, 34, 175)
    current.mid = approach(current.mid, target.mid, deltaMs, 32, 160)
    current.presence = approach(current.presence, target.presence, deltaMs, 26, 145)
    current.high = approach(current.high, target.high, deltaMs, 22, 125)
    current.air = approach(current.air, target.air, deltaMs, 20, 115)
    current.energy = approach(current.energy, target.energy, deltaMs, 38, 170)
    current.transient = approach(current.transient, target.transient, deltaMs, 12, 88)
  }

  private ensureFrameLoop = (): void => {
    if (this.frameRequest || this.frameListeners.size === 0) {
      return
    }

    const tick = (now: number) => {
      if (this.frameListeners.size === 0) {
        this.frameRequest = 0
        this.lastFrameAt = 0
        return
      }

      const deltaMs = this.lastFrameAt > 0 ? Math.min(40, now - this.lastFrameAt) : 16.67
      this.lastFrameAt = now

      this.analyseAudio(now)
      this.smoothVisualLevels(deltaMs)

      const frame: MusicVisualFrame = {
        deltaMs,
        isPlaying: this.state.isPlaying,
        levels: this.visualLevels,
        time: this.getVisualTime(),
      }

      this.frameListeners.forEach((listener) => {
        try {
          listener(frame)
        } catch (error) {
          console.error('[music] Falha em consumidor do frame musical.', error)
        }
      })

      this.frameRequest = window.requestAnimationFrame(tick)
    }

    this.frameRequest = window.requestAnimationFrame(tick)
  }

  private startPlayback = async (): Promise<void> => {
    try {
      this.ensureAudioGraph()

      if (!this.audio || !this.audioContext) {
        throw new Error('Player de música indisponível.')
      }

      // Safari/iOS exige que as duas operações protegidas por gesto sejam iniciadas
      // na mesma pilha de execução. Não pode haver await entre resume() e play().
      const playPromise = this.audio.play()
      const contextPromise =
        this.audioContext.state === 'suspended'
          ? this.audioContext.resume()
          : Promise.resolve()

      await Promise.all([playPromise, contextPromise])

      this.rebaseVisualClock()
      this.setState({ error: '', isPlaying: true, isReady: true })
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Toque na página para continuar a música.'
          : 'Não foi possível iniciar a música.'

      this.setState({ error: message, isPlaying: false, isReady: this.state.isReady })

      if (!(error instanceof DOMException && error.name === 'NotAllowedError')) {
        console.error('[music] Falha ao reproduzir a música.', error)
      }

      throw error
    }
  }

  private ensureAudioGraph = (): void => {
    if (this.audio && this.audioContext && this.analyser && this.sourceNode) {
      return
    }

    const AudioContextConstructor =
      window.AudioContext ?? (window as WebkitAudioWindow).webkitAudioContext

    if (!AudioContextConstructor) {
      throw new Error('Web Audio API não suportada neste navegador.')
    }

    const audio = new Audio(MUSIC_SOURCE)
    audio.autoplay = true
    audio.loop = true
    audio.preload = 'auto'
    audio.setAttribute('playsinline', 'true')
    audio.volume = 0.74

    const audioContext = new AudioContextConstructor()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = MUSIC_FFT_SIZE
    analyser.smoothingTimeConstant = MUSIC_SMOOTHING

    const sourceNode = audioContext.createMediaElementSource(audio)
    sourceNode.connect(analyser)
    analyser.connect(audioContext.destination)

    this.audio = audio
    this.audioContext = audioContext
    this.analyser = analyser
    this.sourceNode = sourceNode
    this.frequencyData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
    this.previousFrequencyData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
    this.timeDomainData = new Uint8Array(new ArrayBuffer(analyser.fftSize))
    this.rebaseVisualClock()

    audio.addEventListener('canplay', () => {
      this.setState({ ...this.state, isReady: true })
    })

    audio.addEventListener('play', () => {
      this.rebaseVisualClock()
      this.setState({ error: '', isPlaying: true, isReady: true })
    })

    audio.addEventListener('pause', () => {
      this.rebaseVisualClock()
      this.targetLevels = createEmptyLevels()
      this.setState({ ...this.state, isPlaying: false })
    })

    audio.addEventListener('seeking', this.rebaseVisualClock)
    audio.addEventListener('seeked', this.rebaseVisualClock)

    audio.addEventListener('ended', () => {
      try {
        audio.currentTime = 0
        this.rebaseVisualClock()
        void this.play().catch(() => undefined)
      } catch (error) {
        console.error('[music] Não foi possível reiniciar a música.', error)
      }
    })

    audio.addEventListener('error', () => {
      this.targetLevels = createEmptyLevels()
      this.setState({
        error: 'Não foi possível carregar a música.',
        isPlaying: false,
        isReady: false,
      })
    })
  }

  private rebaseVisualClock = (): void => {
    this.visualClockMediaTime = this.audio?.currentTime ?? 0
    this.visualClockContextTime = this.audioContext?.currentTime ?? 0
  }

  private setState = (nextState: MusicPlayerState): void => {
    const hasChanged =
      nextState.error !== this.state.error ||
      nextState.isPlaying !== this.state.isPlaying ||
      nextState.isReady !== this.state.isReady

    if (!hasChanged) {
      return
    }

    this.state = nextState
    this.listeners.forEach((listener) => listener())
  }
}

export const musicService = new MusicService()

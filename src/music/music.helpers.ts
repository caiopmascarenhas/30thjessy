export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

export const averageFrequencyBand = (
  data: Uint8Array,
  sampleRate: number,
  minFrequency: number,
  maxFrequency: number,
): number => {
  const nyquist = sampleRate / 2
  const frequencyPerBin = nyquist / data.length
  const startIndex = Math.max(0, Math.floor(minFrequency / frequencyPerBin))
  const endIndex = Math.min(data.length - 1, Math.ceil(maxFrequency / frequencyPerBin))

  if (endIndex < startIndex) {
    return 0
  }

  let sum = 0

  for (let index = startIndex; index <= endIndex; index += 1) {
    sum += data[index] ?? 0
  }

  return clamp01(sum / Math.max(1, endIndex - startIndex + 1) / 255)
}

export const calculateTimeDomainEnergy = (data: Uint8Array): number => {
  if (data.length === 0) {
    return 0
  }

  let squaredSum = 0

  for (const sample of data) {
    const normalized = (sample - 128) / 128
    squaredSum += normalized * normalized
  }

  const rms = Math.sqrt(squaredSum / data.length)

  return clamp01(Math.pow(rms * 2.35, 0.82))
}

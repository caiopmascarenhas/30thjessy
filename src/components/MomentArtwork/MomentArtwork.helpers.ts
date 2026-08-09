export interface ConstellationStar {
  band: number
  drift: number
  phase: number
  prominence: number
  x: number
  y: number
}

export interface ConstellationLink {
  band: number
  from: number
  phase: number
  to: number
}

export interface MomentConstellation {
  links: ConstellationLink[]
  rotationDirection: number
  stars: ConstellationStar[]
}

const TWO_PI = Math.PI * 2
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

const pseudoRandom = (seed: number): number => {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453

  return value - Math.floor(value)
}

const distanceSquared = (a: ConstellationStar, b: ConstellationStar): number => {
  const dx = a.x - b.x
  const dy = a.y - b.y

  return dx * dx + dy * dy
}

const createStars = (momentId: number): ConstellationStar[] => {
  const seed = momentId * 97.31
  const count = 17 + (momentId % 7)
  const rotation = pseudoRandom(seed + 1) * TWO_PI
  const eccentricityX = 0.82 + pseudoRandom(seed + 2) * 0.3
  const eccentricityY = 0.68 + pseudoRandom(seed + 3) * 0.28
  const waveA = 0.12 + pseudoRandom(seed + 4) * 0.28
  const waveB = 0.08 + pseudoRandom(seed + 5) * 0.2
  const radialBias = pseudoRandom(seed + 6) * 0.42

  const stars = Array.from({ length: count }, (_, index) => {
    const progress = (index + 0.5) / count
    const randomA = pseudoRandom(seed + index * 13 + 11)
    const randomB = pseudoRandom(seed + index * 17 + 29)
    const randomC = pseudoRandom(seed + index * 19 + 47)
    const angle =
      rotation +
      index * GOLDEN_ANGLE +
      Math.sin(progress * Math.PI * (2 + (momentId % 4))) * waveA +
      (randomA - 0.5) * 0.22
    const ring = index % 3
    const baseRadius = 94 + ring * 38 + randomB * 30
    const breathingRadius = baseRadius * (0.9 + radialBias * Math.sin(progress * Math.PI))
    const warpX = Math.sin(angle * (1.3 + (momentId % 5) * 0.08)) * 13 * waveB
    const warpY = Math.cos(angle * (1.15 + (momentId % 6) * 0.07)) * 16 * waveA

    return {
      band: (index + momentId) % 7,
      drift: 2.2 + randomC * 4.8,
      phase: randomA * TWO_PI,
      prominence: 0.35 + randomB * 0.65,
      x: 250 + Math.cos(angle) * breathingRadius * eccentricityX + warpX,
      y: 250 + Math.sin(angle) * breathingRadius * eccentricityY + warpY,
    }
  })

  // Duas estrelas de assinatura deixam cada capítulo ainda mais distinto sem formar
  // linhas gigantes atravessando toda a composição.
  stars.push({
    band: (momentId + 2) % 7,
    drift: 3.4,
    phase: pseudoRandom(seed + 801) * TWO_PI,
    prominence: 1,
    x: 250 + Math.cos(rotation + 0.7) * (118 + (momentId % 5) * 9),
    y: 250 + Math.sin(rotation + 0.7) * (92 + (momentId % 4) * 8),
  })
  stars.push({
    band: (momentId + 5) % 7,
    drift: 3,
    phase: pseudoRandom(seed + 911) * TWO_PI,
    prominence: 0.9,
    x: 250 + Math.cos(rotation + Math.PI + 0.18) * (126 + (momentId % 4) * 8),
    y: 250 + Math.sin(rotation + Math.PI + 0.18) * (98 + (momentId % 3) * 10),
  })

  return stars
}

const createLinks = (momentId: number, stars: ConstellationStar[]): ConstellationLink[] => {
  const links: ConstellationLink[] = []
  const used = new Set<string>()
  const maxDistanceSquared = 148 * 148

  const addLink = (from: number, to: number, phaseSeed: number) => {
    if (from === to) {
      return
    }

    const low = Math.min(from, to)
    const high = Math.max(from, to)
    const key = `${low}:${high}`

    if (used.has(key)) {
      return
    }

    const fromStar = stars[from]
    const toStar = stars[to]

    if (!fromStar || !toStar || distanceSquared(fromStar, toStar) > maxDistanceSquared) {
      return
    }

    used.add(key)
    links.push({
      band: (from + to + momentId) % 7,
      from,
      phase: pseudoRandom(momentId * 113 + phaseSeed),
      to,
    })
  }

  // Cada estrela se liga ao vizinho mais próximo. Isso cria desenho de constelação
  // sem os cruzamentos longos em X que deixavam a tela visualmente pesada.
  for (let index = 0; index < stars.length; index += 1) {
    let nearest = -1
    let nearestDistance = Number.POSITIVE_INFINITY

    for (let candidate = 0; candidate < stars.length; candidate += 1) {
      if (candidate === index) {
        continue
      }

      const star = stars[index]
      const other = stars[candidate]

      if (!star || !other) {
        continue
      }

      const candidateDistance = distanceSquared(star, other)

      if (candidateDistance < nearestDistance) {
        nearest = candidate
        nearestDistance = candidateDistance
      }
    }

    if (nearest >= 0) {
      addLink(index, nearest, index * 19 + nearest)
    }
  }

  // Acrescenta algumas ramificações curtas. A quantidade/topologia varia nos 30 capítulos.
  const stride = 3 + (momentId % 3)

  for (let index = 0; index < stars.length; index += stride) {
    const source = stars[index]

    if (!source) {
      continue
    }

    let best = -1
    let bestDistance = Number.POSITIVE_INFINITY

    for (let candidate = 0; candidate < stars.length; candidate += 1) {
      if (candidate === index || Math.abs(candidate - index) < 2) {
        continue
      }

      const target = stars[candidate]

      if (!target) {
        continue
      }

      const candidateDistance = distanceSquared(source, target)

      if (candidateDistance < bestDistance && candidateDistance < 122 * 122) {
        best = candidate
        bestDistance = candidateDistance
      }
    }

    if (best >= 0) {
      addLink(index, best, index * 31 + best * 7)
    }
  }

  return links
}

export const createMomentConstellation = (momentId: number): MomentConstellation => {
  const stars = createStars(momentId)

  return {
    links: createLinks(momentId, stars),
    rotationDirection: momentId % 2 === 0 ? 1 : -1,
    stars,
  }
}

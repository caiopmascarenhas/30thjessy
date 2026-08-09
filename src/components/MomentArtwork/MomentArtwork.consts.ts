export interface ArtworkMotionProfile {
  accentRadius: number
  accentSpeed: number
  bassScale: number
  highScale: number
  primarySpeed: number
  primaryX: number
  primaryY: number
  secondarySpeed: number
  secondaryX: number
  secondaryY: number
  sway: number
}

export const ARTWORK_MOTION_PROFILES: ArtworkMotionProfile[] = [
  { accentRadius: 5, accentSpeed: 0.72, bassScale: 0.022, highScale: 0.012, primarySpeed: 0.42, primaryX: 2, primaryY: 1, secondarySpeed: -0.28, secondaryX: 1, secondaryY: 2, sway: 1.2 },
  { accentRadius: 7, accentSpeed: -0.58, bassScale: 0.018, highScale: 0.016, primarySpeed: -0.3, primaryX: 4, primaryY: 2, secondarySpeed: 0.22, secondaryX: 2, secondaryY: 3, sway: 0.8 },
  { accentRadius: 4, accentSpeed: 0.9, bassScale: 0.028, highScale: 0.01, primarySpeed: 0.18, primaryX: 1, primaryY: 4, secondarySpeed: -0.14, secondaryX: 2, secondaryY: 1, sway: 0.5 },
  { accentRadius: 8, accentSpeed: 1.04, bassScale: 0.024, highScale: 0.02, primarySpeed: 0.56, primaryX: 2, primaryY: 2, secondarySpeed: -0.44, secondaryX: 3, secondaryY: 1, sway: 1.6 },
  { accentRadius: 4, accentSpeed: -0.66, bassScale: 0.016, highScale: 0.018, primarySpeed: -0.22, primaryX: 3, primaryY: 2, secondarySpeed: 0.18, secondaryX: 2, secondaryY: 2, sway: 0.7 },
  { accentRadius: 9, accentSpeed: 0.48, bassScale: 0.02, highScale: 0.012, primarySpeed: 0.14, primaryX: 5, primaryY: 2, secondarySpeed: -0.12, secondaryX: 2, secondaryY: 4, sway: 0.4 },
  { accentRadius: 6, accentSpeed: 0.84, bassScale: 0.018, highScale: 0.022, primarySpeed: 0.34, primaryX: 2, primaryY: 3, secondarySpeed: -0.3, secondaryX: 4, secondaryY: 1, sway: 1.1 },
  { accentRadius: 8, accentSpeed: -0.78, bassScale: 0.022, highScale: 0.014, primarySpeed: -0.46, primaryX: 3, primaryY: 3, secondarySpeed: 0.35, secondaryX: 2, secondaryY: 2, sway: 1.4 },
  { accentRadius: 5, accentSpeed: 0.54, bassScale: 0.024, highScale: 0.01, primarySpeed: 0.12, primaryX: 2, primaryY: 4, secondarySpeed: -0.09, secondaryX: 1, secondaryY: 2, sway: 0.35 },
  { accentRadius: 7, accentSpeed: -0.94, bassScale: 0.019, highScale: 0.02, primarySpeed: -0.38, primaryX: 4, primaryY: 1, secondarySpeed: 0.26, secondaryX: 3, secondaryY: 3, sway: 1.3 },
  { accentRadius: 6, accentSpeed: 0.64, bassScale: 0.021, highScale: 0.013, primarySpeed: 0.27, primaryX: 5, primaryY: 2, secondarySpeed: -0.2, secondaryX: 2, secondaryY: 4, sway: 0.9 },
  { accentRadius: 4, accentSpeed: 1.12, bassScale: 0.025, highScale: 0.021, primarySpeed: 0.62, primaryX: 2, primaryY: 1, secondarySpeed: -0.5, secondaryX: 2, secondaryY: 2, sway: 1.8 },
  { accentRadius: 5, accentSpeed: -0.45, bassScale: 0.016, highScale: 0.011, primarySpeed: -0.11, primaryX: 2, primaryY: 2, secondarySpeed: 0.08, secondaryX: 1, secondaryY: 1, sway: 0.25 },
  { accentRadius: 7, accentSpeed: 0.76, bassScale: 0.02, highScale: 0.017, primarySpeed: 0.29, primaryX: 3, primaryY: 2, secondarySpeed: -0.22, secondaryX: 2, secondaryY: 3, sway: 1.0 },
  { accentRadius: 5, accentSpeed: -0.61, bassScale: 0.024, highScale: 0.012, primarySpeed: -0.18, primaryX: 2, primaryY: 4, secondarySpeed: 0.16, secondaryX: 3, secondaryY: 1, sway: 0.6 },
  { accentRadius: 3, accentSpeed: 0.88, bassScale: 0.014, highScale: 0.019, primarySpeed: 0.24, primaryX: 1, primaryY: 2, secondarySpeed: -0.19, secondaryX: 2, secondaryY: 1, sway: 0.55 },
  { accentRadius: 6, accentSpeed: -0.72, bassScale: 0.018, highScale: 0.016, primarySpeed: -0.31, primaryX: 2, primaryY: 2, secondarySpeed: 0.25, secondaryX: 3, secondaryY: 2, sway: 1.15 },
  { accentRadius: 4, accentSpeed: 0.52, bassScale: 0.026, highScale: 0.01, primarySpeed: 0.1, primaryX: 1, primaryY: 4, secondarySpeed: -0.08, secondaryX: 2, secondaryY: 2, sway: 0.3 },
  { accentRadius: 8, accentSpeed: 1.02, bassScale: 0.023, highScale: 0.022, primarySpeed: 0.48, primaryX: 4, primaryY: 2, secondarySpeed: -0.36, secondaryX: 2, secondaryY: 4, sway: 1.5 },
  { accentRadius: 9, accentSpeed: -0.69, bassScale: 0.02, highScale: 0.015, primarySpeed: -0.25, primaryX: 5, primaryY: 2, secondarySpeed: 0.18, secondaryX: 2, secondaryY: 4, sway: 0.75 },
  { accentRadius: 6, accentSpeed: 0.59, bassScale: 0.018, highScale: 0.012, primarySpeed: 0.16, primaryX: 4, primaryY: 2, secondarySpeed: -0.13, secondaryX: 3, secondaryY: 2, sway: 0.45 },
  { accentRadius: 7, accentSpeed: -0.83, bassScale: 0.017, highScale: 0.022, primarySpeed: -0.37, primaryX: 3, primaryY: 3, secondarySpeed: 0.31, secondaryX: 2, secondaryY: 2, sway: 1.25 },
  { accentRadius: 5, accentSpeed: 0.71, bassScale: 0.019, highScale: 0.018, primarySpeed: 0.33, primaryX: 2, primaryY: 2, secondarySpeed: -0.27, secondaryX: 3, secondaryY: 3, sway: 0.95 },
  { accentRadius: 4, accentSpeed: -0.49, bassScale: 0.015, highScale: 0.014, primarySpeed: -0.14, primaryX: 1, primaryY: 2, secondarySpeed: 0.1, secondaryX: 2, secondaryY: 1, sway: 0.4 },
  { accentRadius: 6, accentSpeed: 0.92, bassScale: 0.016, highScale: 0.02, primarySpeed: 0.4, primaryX: 2, primaryY: 1, secondarySpeed: -0.34, secondaryX: 3, secondaryY: 2, sway: 1.35 },
  { accentRadius: 5, accentSpeed: -0.57, bassScale: 0.022, highScale: 0.013, primarySpeed: -0.21, primaryX: 3, primaryY: 3, secondarySpeed: 0.17, secondaryX: 2, secondaryY: 2, sway: 0.65 },
  { accentRadius: 8, accentSpeed: 1.08, bassScale: 0.02, highScale: 0.023, primarySpeed: 0.52, primaryX: 4, primaryY: 2, secondarySpeed: -0.42, secondaryX: 2, secondaryY: 4, sway: 1.7 },
  { accentRadius: 4, accentSpeed: -0.62, bassScale: 0.018, highScale: 0.014, primarySpeed: -0.16, primaryX: 2, primaryY: 4, secondarySpeed: 0.12, secondaryX: 1, secondaryY: 2, sway: 0.5 },
  { accentRadius: 9, accentSpeed: 0.68, bassScale: 0.021, highScale: 0.016, primarySpeed: 0.26, primaryX: 5, primaryY: 2, secondarySpeed: -0.2, secondaryX: 2, secondaryY: 3, sway: 0.85 },
  { accentRadius: 10, accentSpeed: 1.18, bassScale: 0.03, highScale: 0.026, primarySpeed: 0.64, primaryX: 3, primaryY: 3, secondarySpeed: -0.54, secondaryX: 3, secondaryY: 3, sway: 2.0 },
]

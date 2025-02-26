// Inspired by Bezier Easing, v2.1.0, MIT License, https://github.com/gre/bezier-easing
// Rewritten and adapted to Effekt, v0.10.0, MIT License, https://github.com/effekt-labs/effekt

import type { EasingFunction } from '@/shared/types'

const subPrecision = 0.0000001
const subMaxIterations = 12

const bezier = (t: number, a1: number, a2: number): number =>
  (((1.0 - 3.0 * a2 + 3.0 * a1) * t + (3.0 * a2 - 6.0 * a1)) * t + 3.0 * a1) * t

const subdivide = (
  aX: number,
  aA: number,
  aB: number,
  mX1: number,
  mX2: number,
): number => {
  let currentX: number
  let currentT: number
  let i = 0

  do {
    currentT = aA + (aB - aA) / 2.0
    currentX = bezier(currentT, mX1, mX2) - aX
    if (currentX > 0.0) aB = currentT
    else aA = currentT
  } while (Math.abs(currentX) > subPrecision && ++i < subMaxIterations)

  return currentT
}

/**
 * Creates a `cubic-bezier` easing effect.
 *
 * @example
 *
 * ```ts
 * import { animate } from 'effekt'
 * import { cubicBezier } from 'effekt/easing'
 *
 * animate('.el', {
 *   ease: cubicBezier(0.33, 1, 0.66, 1),
 * })
 * ```
 */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): EasingFunction {
  if (x1 === y1 && x2 === y2) return (p) => p

  const getTForX = (aX: number): number => subdivide(aX, 0, 1, x1, x2)

  return (p) => (p === 0 || p === 1 ? p : bezier(getTForX(p), y1, y2))
}

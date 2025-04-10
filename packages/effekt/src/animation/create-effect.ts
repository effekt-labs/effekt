import { secToMs, round } from '@/utils'
import { isFunction, isArray } from '@/shared'
import type { GeneratedKeyframe } from './types'
import type { DelayFunction, EasingFunction } from '@/shared/types'

const setDelay = (
  delay: number | DelayFunction,
  index: number,
  total: number,
): number => secToMs(isFunction(delay) ? delay(index, total) : delay)

const setRepeat = (repeat: number): number =>
  repeat === Infinity ? 10000 : repeat + 1

const parseEasing = (easing: EasingFunction, points: number = 50): string =>
  `linear(${[...Array(points).keys()]
    .map((_, i) => (i === points - 1 ? 1 : round(easing(i * (1 / points)), 5)))
    .join(',')})`

export const setEasing = (easing?: string | EasingFunction): string =>
  easing
    ? isFunction(easing)
      ? parseEasing(easing)
      : easing
    : 'cubic-bezier(0.33, 0, 0.33, 1)'

export function createEffect(
  { index, total }: { index: number; total: number },
  options: GeneratedKeyframe,
): globalThis.KeyframeAnimationOptions & {
  rangeStart?: string
  rangeEnd?: string
} {
  const {
    id,
    direction,
    duration = 0.6,
    delay = 0,
    endDelay = 0,
    playRate: playbackRate,
    repeat = 0,
    repeatStart: iterationStart,
    ease,
    fillMode = 'both',
    composite,
    pseudoElement,
    repeatComposite: iterationComposite,
    start: rangeStart,
    end: rangeEnd,
  } = options

  return {
    id,
    direction,
    duration: secToMs(duration),
    delay: setDelay(delay, index, total),
    endDelay: setDelay(endDelay, index, total),
    playbackRate,
    iterations: setRepeat(repeat),
    iterationStart,
    easing: !isArray(ease) ? setEasing(ease) : undefined,
    fill: fillMode,
    composite: !isArray(composite) ? composite : undefined,
    pseudoElement,
    iterationComposite,
    rangeStart,
    rangeEnd,
  }
}

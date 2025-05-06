import { secToMs, round } from '@/utils'
import { isFunction, isUndefined } from './is'
import type { DelayFunction, EasingFunction } from './types'

export const setDelay = (
  delay: number | DelayFunction,
  index: number,
  total: number,
): number => secToMs(isFunction(delay) ? delay(index, total) : delay)

export const setRepeat = (repeat: number): number =>
  repeat === Infinity ? 10000 : repeat + 1

export const parseEasing = (
  easing: EasingFunction,
  points: number = 50,
): string =>
  `linear(${[...Array(points).keys()]
    .map((_, i) => (i === points - 1 ? 1 : round(easing(i * (1 / points)), 5)))
    .join(',')})`

export const setEasing = (easing?: string | EasingFunction): string =>
  easing
    ? isFunction(easing)
      ? parseEasing(easing)
      : easing
    : 'cubic-bezier(0.33, 0, 0.33, 1)'

export const parseEffect = <T extends Record<string, any>>(v: T): T =>
  Object.keys(v).reduce(
    (acc, k) => (!isUndefined(v[k]) && (acc[k] = v[k]), acc),
    {} as Record<string, any>,
  ) as T

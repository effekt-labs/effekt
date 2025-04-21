import { secToMs } from '@/utils'
import { isFunction } from './is'
import type { DelayFunction } from './types'

export const setDelay = (
  delay: number | DelayFunction,
  index: number,
  total: number,
): number => secToMs(isFunction(delay) ? delay(index, total) : delay)

export const setRepeat = (repeat: number): number =>
  repeat === Infinity ? 10000 : repeat + 1

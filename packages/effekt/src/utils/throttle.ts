import { isNumber } from '@/shared'
import type { Throttle, ThrottleOptions } from './types'

/**
 * Creates a throttled function that limits how often a function is called.
 *
 * Wraps a custom callback so that it executes no more than once every specified number of milliseconds.
 *
 * Controls the execution rate of performance-critical operations, which can significantly improve performance,
 * especially when handling high-frequency events like scrolling or resizing.
 *
 * Use Cases:
 *
 * - UI Responsiveness: Throttles callbacks for high-frequency events such as scrolling or mouse movement.
 * - Network Requests: Limits how often a function triggers an API call.
 * - State Updates: Controls a function that triggers expensive state updates or reflows.
 *
 * @example
 *
 * ```ts
 * import { throttle } from 'effekt/utils'
 *
 * const onScroll = (): void => {
 *   console.log('scrollY:', window.scrollY)
 * }
 * const throttleScroll = throttle(onScroll, 300)
 *
 * window.addEventListener('scroll', throttleScroll)
 * ```
 */
export function throttle<T extends any[], R>(
  callback: (...args: T) => R,
  options: ThrottleOptions | number,
): Throttle<T, R> {
  const {
    delay,
    leading = true,
    trailing = true,
  }: ThrottleOptions = isNumber(options) ? { delay: options } : options

  let timer: number | NodeJS.Timeout | null = null
  let lastArgs: T | null = null
  let lastResult: R | undefined
  let lastTime: number = 0

  const invoke = (args: T): R => {
    lastTime = performance.now()
    lastResult = callback(...args)
    return lastResult
  }

  const clearTimer = (): void => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const scheduleTrailing = (remaining: number): void => {
    timer = setTimeout(() => {
      clearTimer()
      if (trailing && lastArgs) {
        invoke(lastArgs)
        lastArgs = null
      }
    }, remaining)
  }

  const throttled: Throttle<T, R> = (...args: T): R | undefined => {
    const now = performance.now()

    if (!lastTime && !leading) lastTime = now

    const remaining = delay - (now - lastTime)
    lastArgs = args

    if (remaining <= 0 || remaining > delay) {
      clearTimer()
      invoke(args)
      lastArgs = null
    } else if (!timer && trailing) scheduleTrailing(remaining)

    return lastResult
  }

  const isThrottled = () => performance.now() - lastTime < delay

  throttled.isThrottled = isThrottled

  throttled.trigger = (...args: T): R => {
    clearTimer()
    return invoke(args)
  }

  throttled.flush = (): R | undefined => {
    if (timer) {
      clearTimer()
      if (trailing && lastArgs) return invoke(lastArgs)
    }
    return lastResult
  }

  throttled.cancel = (): void => {
    clearTimer()
    lastArgs = null
  }

  return throttled
}

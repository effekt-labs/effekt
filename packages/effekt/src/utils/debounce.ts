import { isNumber } from '@/shared'
import type { Debounce, DebounceOptions } from './types'

/**
 * Creates a debounced function that delays callback execution until after a specified period of inactivity.
 *
 * Handles rapid, successive invocations by resetting the timer on each call.
 *
 * Helps optimize performance by ensuring the callback only fires when the user activity has ceased.
 *
 * Use Cases:
 *
 * - User Input: Waits until the user stops typing to perform a search or validation.
 * - Window Resizing: Minimizes repeated recalculations during rapid resize events.
 * - API Requests: Prevents request flooding by waiting for user interaction to pause.
 *
 * @example
 *
 * ```ts
 * import { debounce } from 'effekt/utils'
 *
 * const onResize = () => {
 *   console.log('Resized to:', window.innerWidth, 'x', window.innerHeight)
 * }
 *
 * const debouncedResize = debounce(onResize, 300)
 *
 * window.addEventListener('resize', debouncedResize)
 * ```
 */
export function debounce<T extends any[], R>(
  callback: (...args: T) => R,
  options: DebounceOptions | number,
): Debounce<T, R> {
  let {
    delay,
    leading,
    trailing = true,
  }: DebounceOptions = isNumber(options) ? { delay: options } : options

  let timer: number | NodeJS.Timeout | null = null
  let lastArgs: T | null = null
  let lastResult: R | undefined
  let pendingTrailing: boolean = false
  let leadingCalled: boolean = false

  const clearTimer = (): void => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const debounced: Debounce<T, R> = (...args: T): R | undefined => {
    lastArgs = args

    if (timer) {
      pendingTrailing = true
      clearTimer()
    }

    timer = setTimeout(() => {
      if (trailing && (!leading || pendingTrailing)) {
        if (lastArgs) lastResult = callback(...lastArgs)
      }
      clearTimer()
      leadingCalled = false
      pendingTrailing = false
    }, delay)

    if (leading && !leadingCalled) {
      lastResult = callback(...args)
      leadingCalled = true
    }

    return lastResult
  }

  debounced.isPending = (): boolean => timer !== null

  debounced.flush = (): R | undefined => {
    if (timer) {
      clearTimer()
      if (trailing && (!leading || pendingTrailing) && lastArgs) {
        lastResult = callback(...lastArgs)
      }
      leadingCalled = false
      pendingTrailing = false
    }
    return lastResult
  }

  debounced.cancel = (): void => {
    clearTimer()
    pendingTrailing = false
    lastArgs = null
    leadingCalled = false
  }

  return debounced
}

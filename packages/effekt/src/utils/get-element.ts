import { isBrowser, isString } from '@/shared'
import type { AnimationTarget } from '@/animation/types'

/**
 * Gets the parsed DOM element.
 *
 * Converts the given selector to a valid element or returns `null` if it is not found in the DOM.
 *
 * @example
 *
 * ```ts
 * import { getElement } from 'effekt/utils'
 *
 * getElement('.class') // Returns el
 * getElement(document.querySelector('.class')) // Returns el
 * ```
 */
export function getElement<T extends Element = Element>(
  target: AnimationTarget,
): T | null {
  if (!isBrowser) return null

  const el = isString(target) ? document.querySelector(target) : target
  if (el) return el as T

  console.warn('Effekt: The specified element was not found in the DOM.')
  return null
}

import { isBrowser, isString, isArray, isElement } from '@/shared'
import type { AnimationTargets } from '@/animation/types'

/**
 * Gets a parsed list of DOM elements.
 *
 * Converts a given selector or array of elements into a consistent array of valid DOM elements.
 *
 * @example
 *
 * ```ts
 * import { getElements } from 'effekt/utils'
 *
 * getElements('.class') // Returns [el]
 * getElements(document.querySelector('.class')) // Returns [el]
 * getElements(document.querySelectorAll('.class')) // Returns [el1, el2, el3]
 * ```
 */
export function getElements<T extends Element = Element>(
  targets: AnimationTargets,
): T[] {
  if (!isBrowser) return []

  const els = isString(targets) ? document.querySelectorAll(targets) : targets

  if (isElement(els)) return [els] as T[]
  if (els) {
    const arr = !isArray(els) ? [...els] : els.filter((el) => isElement(el))
    if (arr.length) return arr as T[]
  }

  console.warn('Effekt: The specified elements were not found in the DOM.')
  return []
}

import { getElements } from '@/utils'
import { noop, isFunction } from '@/shared'
import type { AnimationTargets } from '@/animation/types'
import type { InViewCallback, InViewOptions, InView } from './types'

/**
 * Triggers a callback when the specified elements enter and leave the viewport.
 *
 * Useful for optimizing performance by only running actions when elements are visible in the viewport.
 *
 * Reduces unnecessary operations on off-screen elements, making it especially beneficial in dynamic or single-page apps where elements may frequently appear and disappear.
 *
 * Use Cases:
 *
 * - Animations: Triggers animations (fade-in/out, slide-up, etc.) when elements enter or leave the viewport.
 * - Lazy Loading: Loads images, videos, or other resources when they come into view, improving initial page load performance.
 * - Infinite Scroll: Detects when the user scrolls to the bottom of the page or container, then loads additional content.
 *
 * @example
 *
 * ```ts
 * import { animate } from 'effekt'
 * import { inView } from 'effekt/interaction'
 *
 * inView('.el', ({ target }) => {
 *   // Triggered when the target enters the viewport
 *   animate(target, { opacity: [0, 1] })
 *
 *   // Triggered when the target leaves the viewport
 *   return (info) => {
 *     animate(target, { opacity: [1, 0] })
 *     console.log(info)
 *   }
 * })
 * ```
 *
 * Also, inView returns a cleanup function that can be invoked to stop observing the elements when needed,
 * such as when the component is destroyed or when the observer is no longer required.
 *
 * @example
 *
 * ```ts
 * const stopInView = inView('.el', ({ target }) => {
 *   animate(target, { opacity: [0, 1] })
 * })
 * // Stops viewport detection
 * stopInView()
 * ```
 */
export function inView(
  targets: AnimationTargets,
  onEnter: (entry: IntersectionObserverEntry) => void | InViewCallback,
  options: InViewOptions = {},
): InView {
  const { root, margin, threshold } = options

  const els = getElements(targets)
  if (!els.length) return noop

  const intersections: WeakMap<Element, InViewCallback> = new WeakMap()

  const onIntersectionChange: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const { target, isIntersecting } = entry

      const onLeave = intersections.get(target)

      if (isIntersecting === !!onLeave) return

      if (isIntersecting) {
        const newOnLeave = onEnter(entry)

        if (isFunction(newOnLeave)) intersections.set(target, newOnLeave)
        else observer.unobserve(target)
      } else if (isFunction(onLeave)) {
        onLeave(entry)
        intersections.delete(target)
      }
    })
  }

  const observer = new IntersectionObserver(onIntersectionChange, {
    root,
    rootMargin: margin,
    threshold,
  })

  els.forEach((el) => observer.observe(el))

  return () => observer.disconnect()
}

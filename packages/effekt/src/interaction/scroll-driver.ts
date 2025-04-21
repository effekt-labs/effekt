import type { ScrollDriverOptions, ScrollDriver } from './types'

/**
 * Creates a driver that synchronizes animation progress with scroll position as it progresses through the page.
 *
 * Monitors a custom scrollable area or a specified target and maps the scrolling progress to the animation progress.
 *
 * Use Cases:
 *
 * - Reveal Effects: Animates specified targets as the user scrolls.
 * - Custom Scroller: Drives animations based on scroll progress within a custom container.
 * - Scroll Direction: Creates vertical or horizontal scroll interactions.
 *
 * @example
 *
 * ```ts
 * import { animate } from 'effekt'
 * import { scrollDriver } from 'effekt/interaction'
 *
 * animate('.el', {
 *   x: [0, 600],
 *   driver: scrollDriver(),
 * })
 * ```
 *
 * Scroll driver also allows for additional customization:
 *
 * @example
 *
 * ```ts
 * scrollDriver({
 *   target: document.querySelector('.el'),
 *   inset: '100px 200px',
 * })
 * ```
 */
export function scrollDriver<T extends ScrollDriverOptions>(
  options = {} as T,
): ScrollDriver<T> {
  const { container = document.documentElement, target, axis, inset } = options

  if (target) return new ViewTimeline({ subject: target, inset, axis })
  return new ScrollTimeline({ source: container, axis }) as ScrollDriver<T>
}

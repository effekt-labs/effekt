import { isBrowser, noop } from '@/shared'
import { clamp, round } from '@/utils'
import { frameDriver } from '@/frame/driver'
import type { ScrollCallback, ScrollOptions, ScrollInfo, Scroll } from './types'

const createTimeline = (
  options: ScrollOptions,
): globalThis.ScrollTimeline | globalThis.ViewTimeline => {
  const { source = document.documentElement, subject, axis, inset } = options

  if (subject) return new ViewTimeline({ subject, inset, axis })
  return new ScrollTimeline({ source, axis })
}

/**
 * Creates a scroll-linked interactions.
 *
 * Monitors the scrolling position as it progresses through the page and maps real-time data such as progress, speed, velocity, and direction.
 *
 * Scroller is lazy by design, meaning it is only called when there is a difference in progress since the last check.
 * This helps avoid unnecessary calculations and maintains efficient updating.
 *
 * Use Cases:
 *
 * - Parallax Effects: Animates DOM elements at different speeds relative to the scroll position.
 * - Scroll Indicators: Updates progress bars, readers, or other UI components to reflect current scroll status.
 * - Interactive UI: Implements sticky headers, dynamic sections, or other interactive elements that respond to user scrolling.
 *
 * @example
 *
 * ```ts
 * import { scroll } from 'effekt/interaction'
 *
 * scroll((info) => {
 *   // Called every time the scroll position is updated
 *   console.log(info)
 * })
 * ```
 *
 * Scroll returns a cleanup function that allows you to manually stop the process at any point,
 * giving you complete control over the scroller's lifecycle.
 *
 * @example
 *
 * ```ts
 * const stopScroll = scroll((info) => {
 *   console.log(info)
 * })
 * // Stops scrolling
 * stopScroll()
 * ```
 *
 * Scroll function is actually driven by the main `frame` manager.
 *
 * In certain scenarios, it may be necessary to synchronize animations with another system or external source.
 *
 * Scroll supports setting up a custom external frame `driver` that allows seamless integration.
 *
 * @example
 *
 * ```ts
 * import type { FrameDriver } from 'effekt/frame'
 *
 * const customDriver: FrameDriver = (update) => {
 *   let rafId: number
 *   let now = performance.now()
 *
 *   const runFrame = (timestamp: number) => {
 *     rafId = requestAnimationFrame(runFrame)
 *     const delta = timestamp - now
 *     now = timestamp
 *     update(delta)
 *   }
 *
 *   return {
 *     start: () => (rafId = requestAnimationFrame(runFrame)),
 *     stop: () => cancelAnimationFrame(rafId),
 *   }
 * }
 *
 * scroll(({ progress }) => console.log(progress), { driver: customDriver })
 * ```
 */
export function scroll(
  callback: ScrollCallback,
  options: ScrollOptions = {},
): Scroll {
  if (!isBrowser) return noop

  const { driver = frameDriver, ease = (p: number) => p } = options
  const { abs } = Math

  let tl: globalThis.ScrollTimeline | globalThis.ViewTimeline | null =
    createTimeline(options)

  let progress: number
  let direction: ScrollInfo['direction'] = 'Down'

  const onFrame = (): void => {
    const time = tl?.currentTime?.value || 0

    let newProgress = clamp(0, 1, time / 100)

    if (newProgress !== progress) {
      const deltaProgress = newProgress - progress || 0

      progress = newProgress

      let velocity =
        progress === 0 || progress === 1 || abs(deltaProgress) < 0.002
          ? 0
          : round(deltaProgress * 1000, 0)

      direction = velocity > 0 ? 'Down' : velocity < 0 ? 'Up' : direction

      callback({
        progress: ease(progress),
        velocity,
        speed: abs(velocity),
        direction,
        isScrolling: velocity !== 0,
      })
    }
  }

  const frame = driver(onFrame)

  frame.start()

  return () => {
    tl = null
    frame.stop()
  }
}

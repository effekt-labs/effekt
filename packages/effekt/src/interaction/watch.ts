import { isBrowser, noop } from '@/shared'
import { frameDriver } from '@/frame/driver'
import type { Animation } from '@/animation/types'
import type { WatchCallback, WatchOptions, Watch } from './types'

/**
 * Syncs animation progress to an external system.
 *
 * Watches the internal state and triggers a custom callback whenever the progress value changes.
 *
 * Watcher is lazy by design, meaning it is only called when there is a difference in progress since the last check.
 * This helps avoid unnecessary calculations and maintains efficient updating.
 *
 * Use Cases:
 *
 * - Animations: Runs frame-by-frame progress calls to create custom animation behaviors.
 * - UI Sync: Updates the state of UI elements (like intros, progress bars or loaders) in real-time as the animation progresses.
 * - Event Triggering: Executes effects exactly when the animation reaches certain progress thresholds.
 *
 * @example
 *
 * ```ts
 * import { animate } from 'effekt'
 * import { watch } from 'effekt/interaction'
 *
 * const animation = animate('.el', { opacity: [0, 1] })
 *
 * watch(animation, (progress) => {
 *   // Called every time the animation is updated
 *   console.log(progress)
 * })
 * ```
 *
 * By default, watching will automatically stop when the animation ends.
 *
 * In addition to the auto-stop feature, watch returns a cleanup function that allows you to manually stop the process at any point,
 * giving you complete control over the watcher's lifecycle.
 *
 * @example
 *
 * ```ts
 * const stopWatch = watch(animation, (progress) => {
 *   console.log(progress)
 * })
 * // Stops watching
 * stopWatch()
 * ```
 *
 * Watch function is actually driven by the main `frame` manager.
 *
 * In certain scenarios, it may be necessary to synchronize animations with another system or external source.
 *
 * Watch supports setting up a custom external frame `driver` that allows seamless integration.
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
 * watch(animation, (progress) => console.log(progress), { driver: customDriver })
 * ```
 */
export function watch(
  animation: Animation,
  callback: WatchCallback,
  options: WatchOptions = {},
): Watch {
  if (!isBrowser) return noop

  const {
    driver = frameDriver,
    ease = (p: number) => p,
    autostop = true,
  } = options

  let progress: number

  const onFrame = (): void => {
    let newProgress = animation.progress

    if (animation.isCompleted) {
      newProgress = 1
      if (autostop) frame.stop()
    }

    if (newProgress !== progress) {
      progress = newProgress
      callback(ease(progress))
    }
  }

  const frame = driver(onFrame)

  frame.start()

  return () => frame.stop()
}

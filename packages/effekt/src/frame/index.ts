import { createFrame } from './frame'

/**
 * Creates a universal `frame` manager.
 *
 * **Frame** is designed to manage and execute processes in different phases of a frame-based loop,
 * typically used for timed operations, making it ideal for game loops, animations or periodic updates.
 *
 * @example
 *
 * ```ts
 * import { frame } from 'effekt/frame'
 *
 * let index = 0
 *
 * // Adds a custom callback to the `update` phase and enables looping
 * const onUpdate = frame.update(
 *   (state) => {
 *     console.log('Update Phase Loop')
 *
 *     index++
 *
 *     if (index > 100) {
 *       frame.cancel(onUpdate)
 *       console.log('Update Phase Loop: Done!', state)
 *     }
 *   },
 *   { loop: true },
 * )
 * ```
 */
export const frame = createFrame()

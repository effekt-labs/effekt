import type { DelayFunction, EasingFunction } from '@/shared/types'

export interface AnimationEffect {
  /**
   * Specifies a unique property that references the animation.
   *
   * @default undefined
   */
  id?: string
  /**
   * Specifies the direction in which the animation will run.
   *
   * - `normal` - runs forwards.
   * - `reverse` - runs backwards.
   * - `alternate` - switches direction after each iteration.
   * - `alternate-reverse` - runs backwards and switches direction after each iteration.
   *
   * @default undefined
   */
  direction?: globalThis.PlaybackDirection
  /**
   * Specifies the playback rate of the animation.
   *
   * The value can be positive, negative, or 0. Positive values play the animation normally,
   * negative values reverse the animation, and 0 pauses the animation.
   *
   * A positive value is a scaling factor, so for example a value of 2 would double
   * the playback rate and 0.5 would slow it in half.
   *
   * @default 1
   */
  playRate?: number
  /**
   * Specifies the duration of the animation in `seconds`.
   *
   * @default 0.6
   */
  duration?: number
  /**
   * Specifies the number of iterations of the animation.
   *
   * @default 0
   */
  repeat?: number
  /**
   * Specifies at what point in the iteration the animation should start.
   *
   * For example, `0.5` would indicate starting halfway through the first iteration.
   *
   * @default 0.0
   */
  repeatStart?: number
  /**
   * Specifies the animation `start` delay in `seconds`.
   *
   * For example, 0.3 means the animation will wait that long before starting.
   *
   * @default 0
   */
  delay?: number | DelayFunction
  /**
   * Specifies the animation `end` delay in `seconds`.
   *
   * For example, 0.3 means that the animation will wait that long before it ends completely.
   *
   * @default 0
   */
  endDelay?: number | DelayFunction
  /**
   * Defines how the element to which the animation is applied should look when the animation sequence is not actively running.
   *
   * @default 'both'
   */
  fillMode?: globalThis.FillMode
  /**
   * Specifies the mathematical function used in the interpolation between the `start` and `end` keyframes.
   *
   * @default 'cubic-bezier(0.33, 0, 0.33, 1)'
   */
  ease?: string | EasingFunction | (string | EasingFunction)[]
  /**
   * Determines how values are combined between this animation and other.
   *
   * @default undefined
   */
  composite?:
    | globalThis.CompositeOperation
    | globalThis.CompositeOperationOrAuto[]
  /**
   * Determines how values build from iteration to iteration in this animation
   *
   * @default undefined
   */
  repeatComposite?: globalThis.IterationCompositeOperation
  /**
   * Specifies a pseudo-element selector, such as `::before`.
   *
   * Applies the animation to the selected pseudo-element of the target, instead of the target itself.
   *
   * @default undefined
   */
  pseudoElement?: string | null
  /**
   * Specifies the animation `driver`.
   *
   * @default undefined
   */
  driver?: AnimationDriver
  /**
   * Specifies the position where the animation `begins` progressing.
   *
   * @default undefined
   */
  start?: string
  /**
   * Specifies the position where the animation `completes`.
   *
   * @default undefined
   */
  end?: string
}

export type AnimationDriver = globalThis.AnimationTimeline | null

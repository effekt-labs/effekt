import type { AnimationEffect } from './effect'
import type { AnimationKeyframes } from './keyframes'
import type { AnimationEvents } from './events'

export interface AnimationOptions
  extends AnimationKeyframes,
    AnimationEvents,
    AnimationEffect {
  /**
   * Specifies whether the animation will play automatically when `animate()` is called.
   *
   * If disabled, the animation must be explicitly started with the `.play()` method.
   *
   * @default true
   */
  autoplay?: boolean
  /**
   * Specifies whether inline styles should be added to the animated target when the animation ends.
   *
   * @default true
   */
  commitStyles?: boolean
  /**
   * Specifies a number or array of numbers between `0.0` and `1.0`.
   *
   * Defines at which stage each keyframe should be reached through the animation.
   *
   * If some value is null or missing, the keyframe will be evenly spaced between adjacent keyframes.
   *
   * @default undefined
   */
  offset?: number | (number | null)[]
}

export type AnimationPropertyNames =
  | 'startTime'
  | 'currentTime'
  | 'playbackRate'
  | 'effect'
  | 'timeline'

export type AnimationEventNames =
  | 'play'
  | 'pause'
  | 'reverse'
  | 'cancel'
  | 'finish'

export type AnimationPromise = Promise<globalThis.Animation[]>

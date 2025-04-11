export interface AnimationOptionsCustom {
  /**
   * Specifies whether the animation will play automatically when `animate()` is called.
   *
   * If disabled, the animation must be explicitly started with the `.play()` method.
   *
   * @default true
   */
  autoplay?: boolean
  /**
   * Specifies whether the animation's `flow` mode completes or remains active when the animation ends.
   *
   * - `complete` — writes the final animation state into the element's `style` attribute and ends all associated processes.
   * - `extend` — preserves the animation state, keeping progress and processes for continued activity (requires manual stopping).
   *
   * @default 'complete'
   */
  flow?: 'complete' | 'extend'
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

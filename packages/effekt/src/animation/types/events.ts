export interface AnimationEvents {
  /**
   * Triggered when animations start.
   *
   * This event occurs at the beginning of the animation sequence.
   *
   * It can be used to initialize animation-related settings or to trigger other actions.
   *
   * @default undefined
   */
  onStart?: (animations: globalThis.Animation[]) => void
  /**
   * Triggered when animations are played.
   *
   * This event occurs when animations transition from a paused or stopped state to a playing state.
   *
   * It can be used to resume animations, update the UI, or synchronize other animations.
   *
   * @default undefined
   */
  onPlay?: (animations: globalThis.Animation[]) => void
  /**
   * Triggered when animations are paused.
   *
   * This event occurs when animations are temporarily halted.
   *
   * It can be used to save the current state of animations, update the UI, or perform other actions.
   *
   * @default undefined
   */
  onPause?: (animations: globalThis.Animation[]) => void
  /**
   * Triggered when animations are reversed.
   *
   * This event occurs when the direction of animations is reversed, causing them to play in a different direction.
   *
   * It can be used to handle reverse animations or perform other actions specific to reverse state.
   *
   * @default undefined
   */
  onReverse?: (animations: globalThis.Animation[]) => void
  /**
   * Triggered when animations are stopped.
   *
   * This event occurs when animations are completely stopped before their natural completion.
   *
   * It can be used to stop animations, release resources, or perform specific tasks.
   *
   * @default undefined
   */
  onStop?: (animations: globalThis.Animation[]) => void
  /**
   * Triggered when animations complete their run.
   *
   * This event occurs when animations reach their end point naturally.
   *
   * It can be used to trigger actions that should only happen once animations are fully complete.
   *
   * @default undefined
   */
  onComplete?: (animations: globalThis.Animation[]) => void
  /**
   * Triggered when animations are canceled due to error.
   *
   * This event occurs when animations are interrupted or canceled due to an error or external cause.
   *
   * It can be used to handle errors gracefully, log error information, or attempt recovery actions.
   *
   * @default undefined
   */
  onCancel?: (error: any) => void
}

import type { Animation, WebAnimation } from '@/animation/types'

export interface SequenceEvents {
  /**
   * Triggered when the sequence start.
   *
   * This event occurs at the beginning of the sequence.
   *
   * It can be used to initialize sequence-related settings or to trigger other actions.
   *
   * @default undefined
   */
  onStart?: (animations: Animation[]) => void
  /**
   * Triggered when the sequence is played.
   *
   * This event occurs when the sequence transition from a paused or stopped state to a playing state.
   *
   * It can be used to resume animations, update the UI, or synchronize other animations.
   *
   * @default undefined
   */
  onPlay?: (animations: Animation[]) => void
  /**
   * Triggered when the sequence is paused.
   *
   * This event occurs when the sequence are temporarily halted.
   *
   * It can be used to save the current state of animations, update the UI, or perform other actions.
   *
   * @default undefined
   */
  onPause?: (animations: Animation[]) => void
  /**
   * Triggered when the sequence is stopped.
   *
   * This event occurs when animations are completely stopped before their natural completion.
   *
   * It can be used to stop animations, release resources, or perform specific tasks.
   *
   * @default undefined
   */
  onStop?: (animations: Animation[]) => void
  /**
   * Triggered when the sequence ends.
   *
   * This event occurs when animations reach their end point naturally.
   *
   * It can be used to trigger actions that should only happen once animations are fully complete.
   *
   * @default undefined
   */
  onComplete?: (animations: WebAnimation[][]) => void
  /**
   * Triggered when the sequence is canceled due to error.
   *
   * This event occurs when animations are interrupted or canceled due to an error or external cause.
   *
   * It can be used to handle errors gracefully, log error information, or attempt recovery actions.
   *
   * @default undefined
   */
  onCancel?: (error: any) => void
}

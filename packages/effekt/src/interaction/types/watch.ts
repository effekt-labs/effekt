import type { EasingFunction } from '@/shared/types'
import type { FrameDriver } from '@/frame/types'

export interface WatchInfo {
  progress: number
}

export type WatchCallback = (info: WatchInfo) => void

export type Watch = () => void

export interface WatchOptions {
  /**
   * Specifies whether the watcher should automatically stop tracking after the animation ends.
   *
   * @default true
   */
  autostop?: boolean
  /**
   * Specifies optional easing function that transforms the raw, linear progress value into a more dynamic, non-linear custom effect.
   *
   * @default (p: number) => p
   */
  ease?: EasingFunction
  /**
   * Specifies a custom frame driver that controls the timing and scheduling of the animation updates.
   *
   * @default frameDriver
   */
  driver?: FrameDriver
}

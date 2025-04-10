import type { FrameDriver } from '@/frame/types'
import type { EasingFunction } from '@/shared/types'
import type { ScrollDriverOptions } from './scroll-driver'

export interface ScrollInfo {
  progress: number
  velocity: number
  speed: number
  direction: 'Up' | 'Down'
  isScrolling: boolean
}

export type ScrollCallback = (info: ScrollInfo) => void

export type Scroll = () => void

export interface ScrollOptions extends ScrollDriverOptions {
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

import type { SequenceEvents } from './events'
import type {
  AnimationTargets,
  AnimationOptions,
  AnimationDriver,
  WebAnimation,
} from '@/animation/types'

export type SequenceAnimation = [
  AnimationTargets,
  Omit<AnimationOptions, 'driver'>,
]

export interface SequenceOptions extends SequenceEvents {
  /**
   * Specifies the animation `driver`.
   *
   * @default undefined
   */
  driver?: AnimationDriver
}

export type SequenceEventNames =
  | 'play'
  | 'pause'
  | 'stop'
  | 'complete'
  | 'cancel'

export type SequencePromise = Promise<WebAnimation[][]>

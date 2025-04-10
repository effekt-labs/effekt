import type { AnimationDriver } from '@/animation/types'
import type { SequencePromise } from './options'

export interface Sequence {
  play(): Promise<void>
  pause(): void
  stop(): void
  complete(): void
  cancel(): void
  completed: SequencePromise
  get driver(): AnimationDriver
  set driver(d: AnimationDriver)
  get isCompleted(): Readonly<boolean>
}

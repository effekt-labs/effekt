import type { AnimationPromise } from './options'

export interface Animation {
  play(): void
  pause(): void
  reverse(): void
  stop(): void
  complete(): void
  cancel(): void
  completed: AnimationPromise
  get startTime(): number
  set startTime(t: number)
  get time(): number
  set time(t: number)
  get playRate(): number
  set playRate(r: number)
  get effect(): globalThis.AnimationEffect | null
  set effect(e: globalThis.AnimationEffect | null)
  get timeline(): globalThis.AnimationTimeline | null
  set timeline(t: globalThis.AnimationTimeline | null)
  get playState(): Readonly<globalThis.AnimationPlayState>
  get progress(): number
  set progress(t: number)
  get isCompleted(): Readonly<boolean>
}

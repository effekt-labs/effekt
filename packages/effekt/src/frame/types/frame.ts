export type PhaseIDs = 'read' | 'update' | 'render'

export type PhaseCallback = (state: FrameState) => void

export interface PhaseScheduleOptions {
  loop?: boolean
  schedule?: boolean
}

export type PhaseSchedule = (
  callback: PhaseCallback,
  options?: PhaseScheduleOptions,
) => PhaseCallback

export interface Phase {
  schedule: PhaseSchedule
  run: (state: FrameState) => void
  cancel: (callback: PhaseCallback) => void
  clear: () => void
}

export interface FrameState {
  delta: number
  timestamp: number
  isRunning: boolean
  isPaused: boolean
}

export type FramePhases = {
  [K in PhaseIDs]: PhaseSchedule
}

export type Frame = {
  play: () => void
  pause: () => void
  cancel: (callback: PhaseCallback) => void
  clear: () => void
  get state(): Readonly<FrameState>
} & FramePhases

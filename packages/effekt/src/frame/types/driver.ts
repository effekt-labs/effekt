export interface FrameDriverControls {
  start: () => void
  stop: () => void
}

export type FrameDriverUpdate = (timestamp: number) => void

export type FrameDriver = (update: FrameDriverUpdate) => FrameDriverControls

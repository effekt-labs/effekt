import { frame } from './'
import type { FrameDriver, FrameState } from './types'

export const frameDriver: FrameDriver = (update) => {
  const runFrame = ({ timestamp }: FrameState) => update(timestamp)

  return {
    start: () => frame.update(runFrame, { loop: true }),
    stop: () => frame.cancel(runFrame),
  }
}

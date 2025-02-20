// Inspired by Frame, v0.1.1, MIT License, https://github.com/hypernym-studio/frame
// Adapted to Effekt, v0.10.0, MIT License, https://github.com/effekt-labs/effekt

import { config } from '@/config'
import { isBrowser } from '@/shared'
import type {
  Phase,
  PhaseIDs,
  PhaseCallback,
  PhaseScheduleOptions,
  FrameState,
  Frame,
} from './types'

const defaultState = (): FrameState => ({
  delta: 0.0,
  timestamp: 0.0,
  isRunning: false,
  isPaused: false,
})

export function createFrame(): Frame {
  let fps: number | undefined = config.frame?.fps

  const framePhases: PhaseIDs[] = ['read', 'update', 'render']
  const phases = {} as Record<PhaseIDs, Phase>
  const loops = new Set<PhaseCallback>()

  let tickerId: number | null = null
  let shouldRunTicker: boolean = false
  let isPaused: boolean = false

  const frameInterval: number = 1000 / (fps || 60)
  let lastFrameTime: number = 0
  let lastPauseTime: number | null = null
  let totalPausedTime: number = 0
  let useFrameInterval: boolean = true

  let state: FrameState = defaultState()

  const phase = (callback: (id: Phase) => void): void =>
    framePhases.forEach((id) => callback(phases[id]))

  const createPhase = (): Phase => {
    let thisFrame = new Set<PhaseCallback>()
    let nextFrame = new Set<PhaseCallback>()

    let isRunning: boolean = false
    let flushNextFrame: boolean = false

    const runPhaseCallback = (callback: PhaseCallback): void => {
      if (loops.has(callback)) phase.schedule(callback)
      callback(state)
    }

    const swapFrames = () => ([thisFrame, nextFrame] = [nextFrame, thisFrame])

    const phase: Phase = {
      schedule: (
        callback: PhaseCallback,
        { loop, schedule = true }: PhaseScheduleOptions = {},
      ): PhaseCallback => {
        const queue = isRunning && !schedule ? thisFrame : nextFrame
        if (loop) loops.add(callback)
        if (!queue.has(callback)) queue.add(callback)
        return callback
      },
      run: (state: FrameState): void => {
        if (isRunning) {
          flushNextFrame = true
          return
        }

        isRunning = true

        swapFrames()
        thisFrame.forEach(runPhaseCallback)
        thisFrame.clear()

        isRunning = false

        if (flushNextFrame) {
          flushNextFrame = false
          phase.run(state)
        }
      },
      cancel: (callback: PhaseCallback): void => {
        nextFrame.delete(callback)
        loops.delete(callback)
      },
      clear: (): void => {
        thisFrame.clear()
        nextFrame.clear()
      },
    }
    return phase
  }

  const runTicker = (): void => {
    if (isBrowser) tickerId = requestAnimationFrame(runFrame)
  }

  const cancelTicker = (): void => {
    if (isBrowser && tickerId) {
      cancelAnimationFrame(tickerId)
      tickerId = null
    }
  }

  const runFrame = (timestamp: number): void => {
    const time = timestamp - totalPausedTime
    shouldRunTicker = loops.size > 0

    if (fps) {
      const delta = time - lastFrameTime
      if (delta < frameInterval) {
        runTicker()
        return
      }
      lastFrameTime = time - (delta % frameInterval)
    }

    state.delta = useFrameInterval ? frameInterval : time - state.timestamp
    state.timestamp = time
    state.isPaused = isPaused

    state.isRunning = true

    phase((id) => id.run(state))

    state.isRunning = false

    if (shouldRunTicker && !isPaused) {
      useFrameInterval = false
      runTicker()
    } else cancelTicker()
  }

  const frame: Frame = {
    play: (): void => {
      if (isPaused && shouldRunTicker) {
        isPaused = false
        const now = performance.now()
        if (lastPauseTime) {
          totalPausedTime += now - lastPauseTime
          lastPauseTime = null
        }
        lastFrameTime = now - totalPausedTime
        state.timestamp = lastFrameTime
        runTicker()
      }
    },
    pause: (): void => {
      if (!isPaused) {
        isPaused = true
        cancelTicker()
        lastPauseTime = performance.now()
      }
    },
    cancel: (callback: PhaseCallback): void => {
      phase((id) => id.cancel(callback))
    },
    clear: (): void => {
      state = defaultState()
      phase((id) => id.clear())
      cancelTicker()
      shouldRunTicker = false
    },
    get state(): Readonly<FrameState> {
      return state
    },
  } as Frame

  framePhases.forEach((id) => {
    phases[id] = createPhase()
    frame[id] = (
      callback: PhaseCallback,
      options: PhaseScheduleOptions = {},
    ) => {
      if (!shouldRunTicker) {
        useFrameInterval = true
        lastFrameTime = performance.now()
        runTicker()
      }
      return phases[id].schedule(callback, options)
    }
  })

  return frame
}

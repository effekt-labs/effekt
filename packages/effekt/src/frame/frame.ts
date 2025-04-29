// Inspired by Hypernym Frame, v0.2.0, MIT License, https://github.com/hypernym-studio/frame
// Adapted to Effekt, v0.11.0, MIT License, https://github.com/effekt-labs/effekt

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

  let loops = new WeakSet<PhaseCallback>()
  let activeLoops: number = 0

  let tickerId: number | null = null
  let shouldRunTicker: boolean = false
  let isPaused: boolean = false

  const frameInterval: number = 1000 / (fps || 60)
  const maxDeltaTime: number = 40
  let lastFrameTime: number = 0
  let lastPauseTime: number | null = null
  let totalPausedTime: number = 0

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
        if (loop) {
          if (!loops.has(callback)) activeLoops++
          loops.add(callback)
        }
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
        if (loops.has(callback)) activeLoops--
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

  const runFrame = (): void => {
    const now = performance.now()
    const time = now - totalPausedTime

    shouldRunTicker = activeLoops > 0

    if (fps) {
      const delta = time - lastFrameTime
      if (delta < frameInterval) {
        if (!isPaused) runTicker()
        return
      }
      lastFrameTime = time - (delta % frameInterval)
      state.delta = frameInterval
    } else {
      state.delta =
        state.timestamp === 0
          ? frameInterval
          : Math.min(Math.max(time - state.timestamp, 1), maxDeltaTime)
      lastFrameTime = time
    }

    state.timestamp = time
    state.isPaused = isPaused

    state.isRunning = true

    phase((id) => id.run(state))

    state.isRunning = false

    if (shouldRunTicker && !isPaused) runTicker()
    else cancelTicker()
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
      loops = new WeakSet()
      activeLoops = 0
      phase((id) => id.clear())
      cancelTicker()
      shouldRunTicker = false
    },
    get state(): Readonly<FrameState> {
      return state
    },
    get activeLoops(): Readonly<number> {
      return activeLoops
    },
  } as Frame

  framePhases.forEach((id) => {
    phases[id] = createPhase()
    frame[id] = (
      callback: PhaseCallback,
      options: PhaseScheduleOptions = {},
    ) => {
      if (!shouldRunTicker) {
        shouldRunTicker = true
        lastFrameTime = performance.now()
        runTicker()
      }
      return phases[id].schedule(callback, options)
    }
  })

  return frame
}

import { noop } from '@/shared'
import { nextTick } from '@/utils'
import { createAnimation } from '@/animation'
import type {
  Sequence,
  SequenceAnimation,
  SequenceOptions,
  SequenceEventNames,
} from './types'
import type {
  Animation,
  AnimationDriver,
  WebAnimation,
} from '@/animation/types'

export function createSequence(
  animations: SequenceAnimation[],
  options: SequenceOptions = {},
): Sequence {
  const { driver } = options

  const sequence: Animation[] = []
  let isCompleted: boolean = false
  let isDriver: boolean = driver ? true : false

  let resolve: (value: WebAnimation[][]) => void
  let reject: (value: any) => void

  for (let i = 0, l = animations.length; i < l; i++) {
    const [targets, settings] = animations[i]

    const animation = createAnimation(targets, {
      autoplay: false,
      ...settings,
      driver,
    })

    sequence.push(animation)
  }

  let isReady: boolean = sequence.length > 0

  const each = (callback: (a: Animation) => void): void => {
    for (let i = 0, l = sequence.length; i < l; i++) callback(sequence[i])
  }

  const run = (name: SequenceEventNames): void => each((a) => a[name]())

  const call = (callback?: (sequence: Animation[]) => void): void => {
    if (isReady) callback?.(sequence)
  }

  const sequencer: Sequence = {
    async play(): Promise<void> {
      call(options.onPlay)
      try {
        for (const a of sequence) {
          a.play()
          await a.completed
        }
      } catch {}
    },
    pause(): void {
      run('pause')
      call(options.onPause)
    },
    stop(): void {
      run('stop')
      call(options.onStop)
    },
    complete(): void {
      run('complete')
    },
    cancel(): void {
      run('cancel')
    },
    completed: new Promise((res, rej): void => {
      resolve = res
      reject = rej
    }),
    get driver(): AnimationDriver {
      return sequence[0]?.driver || null
    },
    set driver(d) {
      isDriver ||= true
      each((a) => (a.driver = d))
    },
    get isCompleted(): Readonly<boolean> {
      return isCompleted
    },
  }

  if (isReady) {
    options.onStart?.(sequence)

    sequencer.completed.catch(noop)

    Promise.all(sequence.map((a) => a.completed))
      .then((a) => {
        isCompleted = true
        nextTick(() => {
          resolve?.(a)
          options.onComplete?.(a)
        })
      })
      .catch((err) => {
        nextTick(() => {
          reject?.(err)
          options.onCancel?.(err)
        })
      })
  }

  return sequencer
}

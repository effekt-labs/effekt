import { generateKeyframes } from './generate-keyframes'
import { createEffect, setEasing } from './create-effect'
import { config } from '@/config'
import { noop, isNumber, isArray } from '@/shared'
import { getElements, msToSec, secToMs, nextTick } from '@/utils'
import type {
  Animation,
  AnimationTargets,
  AnimationOptions,
  AnimationPropertyNames,
  AnimationEventNames,
  GeneratedKeyframe,
} from './types'

export function createAnimation(
  targets: AnimationTargets,
  options: AnimationOptions,
): Animation {
  const {
    autoplay = config.animation?.autoplay,
    commitStyles = config.animation?.commitStyles,
    timeline,
  } = options

  const animations: globalThis.Animation[] = []
  let isCompleted: boolean = false
  let isTimeline: boolean = timeline ? true : false

  let resolve: (value: globalThis.Animation[]) => void
  let reject: (value: any) => void

  const els = getElements(targets)

  if (els.length) {
    const keyframes = new WeakMap<Element, GeneratedKeyframe[]>([
      [els[0], generateKeyframes(options)],
    ])

    for (let i = 0, l = els.length; i < l; i++) {
      const el = els[i]

      for (let kI = 0, kL = keyframes.get(els[0])!.length; kI < kL; kI++) {
        const keyframe = keyframes.get(els[0])![kI]
        const { key, value, ease, composite, offset, id, playRate } = keyframe

        const animation = new Animation(
          new KeyframeEffect(
            el,
            {
              [key]: value as any,
              easing: isArray(ease) ? ease.map((e) => setEasing(e)) : undefined,
              composite: isArray(composite) ? composite : undefined,
              offset,
            },
            createEffect({ index: i, total: l }, keyframe),
          ),
          timeline,
        )

        if (id) animation.id = id
        if (playRate) animation.playbackRate = playRate

        if (autoplay) animation.play()
        if (commitStyles) {
          animation.finished
            .then((a) => {
              a.commitStyles()
              a.cancel()
            })
            .catch(noop)
        }
        animations.push(animation)
      }
    }
  }

  let isReady: boolean = els.length > 0

  const each = (callback: (a: globalThis.Animation) => void): void => {
    for (let i = 0, l = animations.length; i < l; i++) callback(animations[i])
  }

  const set = <
    T extends globalThis.Animation,
    K extends AnimationPropertyNames,
  >(
    name: AnimationPropertyNames,
    value: T[K],
  ): void => each((k) => (k[name] = value as any))

  const run = (name: AnimationEventNames): void => each((a) => a[name]())

  const call = (
    callback?: (animations: globalThis.Animation[]) => void,
  ): void => {
    if (isReady) callback?.(animations)
  }

  const numberish = (v: globalThis.CSSNumberish): number =>
    isNumber(v) ? v : (v as globalThis.CSSUnitValue).value

  const getAnimation = (): globalThis.Animation | null => {
    if (isReady) {
      if (isTimeline) return animations[0]
      return animations.reduce((prev, curr) => {
        const pT = prev.effect?.getComputedTiming().endTime as number
        const cT = curr.effect?.getComputedTiming().endTime as number
        return numberish(pT) > numberish(cT) ? prev : curr
      })
    }
    return null
  }

  const instance = {
    value: getAnimation(),
    get endTime(): Readonly<number | null> {
      const t = this.value?.effect?.getComputedTiming().endTime
      return t ? numberish(t) : null
    },
    get time(): Readonly<number | null> {
      const t = this.value?.currentTime
      return t ? numberish(t) : null
    },
  }

  const animation: Animation = {
    play(): void {
      run('play')
      call(options.onPlay)
    },
    pause(): void {
      run('pause')
      call(options.onPause)
    },
    reverse(): void {
      run('reverse')
      call(options.onReverse)
    },
    stop(): void {
      each((a) => {
        a.commitStyles()
        a.cancel()
      })
      call(options.onStop)
    },
    complete(): void {
      run('finish')
    },
    cancel(): void {
      run('cancel')
    },
    completed: new Promise((res, rej): void => {
      resolve = res
      reject = rej
    }),
    get startTime(): number {
      return msToSec(numberish(animations[0].startTime || 0))
    },
    set startTime(t) {
      set('startTime', secToMs(t))
    },
    get time(): number {
      return msToSec(instance.time || 0)
    },
    set time(t) {
      set('currentTime', secToMs(t))
    },
    get playRate(): number {
      return instance.value?.playbackRate || 1
    },
    set playRate(r) {
      set('playbackRate', r)
    },
    get effect(): globalThis.AnimationEffect | null {
      return instance.value?.effect || null
    },
    set effect(e) {
      set('effect', e)
    },
    get timeline(): globalThis.AnimationTimeline | null {
      return instance.value?.timeline || null
    },
    set timeline(t) {
      isTimeline ||= true
      set('timeline', t)
    },
    get playState(): Readonly<globalThis.AnimationPlayState> {
      return instance.value?.playState || 'idle'
    },
    get progress(): Readonly<number> {
      const cT = instance.time
      const eT = instance.endTime
      return cT && eT ? cT / eT : 0
    },
    get isCompleted(): Readonly<boolean> {
      return isCompleted && !isTimeline
    },
  }

  if (isReady) {
    options.onStart?.(animations)

    animation.completed.catch(noop)

    Promise.all(animations.map((a) => a.finished))
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

  return animation
}

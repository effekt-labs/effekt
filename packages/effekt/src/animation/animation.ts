import { generateKeyframes } from './generate-keyframes'
import { config } from '@/config'
import { noop, isNumber, isArray, setDelay, setEasing } from '@/shared'
import { getElements, msToSec, secToMs, clamp } from '@/utils'
import type {
  Animation,
  AnimationTargets,
  AnimationOptions,
  AnimationDriver,
  AnimationPropertyNames,
  AnimationEventNames,
  AnimationEffect,
  AnimationPlayState,
  GeneratedKeyframe,
  WebAnimation,
} from './types'

export function createAnimation(
  targets: AnimationTargets,
  options: AnimationOptions,
): Animation {
  const {
    autoplay = config.animation?.autoplay,
    flow = config.animation?.flow,
    driver,
  } = options

  const animations: WebAnimation[] = []
  let isCompleted: boolean = false
  let isDriver: boolean = driver ? true : false

  let resolve: (value: WebAnimation[]) => void
  let reject: (value: any) => void

  const els = getElements(targets)

  if (els.length) {
    const weakKey = {}
    const keyframes = new WeakMap<WeakKey, GeneratedKeyframe[]>([
      [weakKey, generateKeyframes(options)],
    ])

    for (let i = 0, l = els.length; i < l; i++) {
      const el = els[i]

      for (let kI = 0, kL = keyframes.get(weakKey)!.length; kI < kL; kI++) {
        const keyframe = keyframes.get(weakKey)![kI]
        const { key, value, ease, composite, offset, effect } = keyframe

        const animation = el.animate(
          {
            [key]: value as any,
            easing: isArray(ease) ? ease.map((e) => setEasing(e)) : undefined,
            composite: isArray(composite) ? composite : undefined,
            offset,
          },
          {
            ...effect,
            delay: setDelay(effect.delay ?? 0, i, l),
            endDelay: setDelay(effect.endDelay ?? 0, i, l),
            timeline: driver,
          },
        )

        if (!autoplay) animation.pause()
        if (flow === 'complete') {
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

  const each = (callback: (a: WebAnimation) => void): void => {
    for (let i = 0, l = animations.length; i < l; i++) callback(animations[i])
  }

  const set = <T extends WebAnimation, K extends AnimationPropertyNames>(
    name: AnimationPropertyNames,
    value: T[K],
  ): void => each((k) => (k[name] = value as any))

  const run = (name: AnimationEventNames): void => each((a) => a[name]())

  const call = (callback?: (animations: WebAnimation[]) => void): void => {
    if (isReady) callback?.(animations)
  }

  const numberish = (v: globalThis.CSSNumberish | number): number =>
    isNumber(v) ? v : (v as globalThis.CSSUnitValue).value

  const getAnimation = (): WebAnimation | null => {
    if (isReady) {
      if (isDriver) return animations[0]
      return animations.reduce((prev, curr) => {
        const pT = numberish(prev.effect?.getComputedTiming().endTime || 0)
        const cT = numberish(curr.effect?.getComputedTiming().endTime || 0)
        return pT > cT ? prev : curr
      })
    }
    return null
  }

  const instance = {
    value: getAnimation(),
    get time(): Readonly<number> {
      return numberish(this.value?.currentTime || 0)
    },
    get endTime(): Readonly<number> {
      return numberish(this.value?.effect?.getComputedTiming().endTime || 0)
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
      return msToSec(instance.time)
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
    get effect(): AnimationEffect | null {
      return instance.value?.effect || null
    },
    set effect(e) {
      set('effect', e)
    },
    get driver(): AnimationDriver {
      return instance.value?.timeline || null
    },
    set driver(d) {
      isDriver ||= true
      set('timeline', d)
    },
    get playState(): Readonly<AnimationPlayState> {
      return instance.value?.playState || 'idle'
    },
    get progress(): number {
      return clamp(0, 1, instance.time / instance.endTime)
    },
    set progress(p) {
      set('currentTime', secToMs(msToSec(instance.endTime) * p))
    },
    get isCompleted(): Readonly<boolean> {
      return isCompleted && flow === 'complete'
    },
  }

  if (isReady) {
    options.onStart?.(animations)

    animation.completed.catch(noop)

    Promise.all(animations.map((a) => a.finished))
      .then((a) => {
        isCompleted = true
        queueMicrotask(() => {
          resolve?.(a)
          options.onComplete?.(a)
        })
      })
      .catch((err) => {
        queueMicrotask(() => {
          reject?.(err)
          options.onCancel?.(err)
        })
      })
  }

  return animation
}

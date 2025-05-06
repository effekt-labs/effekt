import { config } from '@/config'
import {
  isNumber,
  isString,
  isArray,
  isObject,
  setUnit,
  rgxIsTransform,
  parseEffect,
} from '@/shared'
import { createEffect } from './create-effect'
import type {
  AnimationOptions,
  AnimationOptionsEffect,
  AnimationOptionsKeyframes,
  GeneratedKeyframe,
} from './types'

const parseKeyframeValue = (
  key: string,
  value: AnimationOptionsKeyframes[keyof AnimationOptionsKeyframes],
  effect: AnimationOptionsEffect,
  prop?: string,
): GeneratedKeyframe => {
  const options = isObject(value) && !isArray(value) && value
  const effectOptions: AnimationOptionsEffect = {
    ...effect,
    ...(options || {}),
  }
  const keyframe: GeneratedKeyframe = {
    value: (options && options.value) || value,
    key: prop || key,
    effect: createEffect(effectOptions),
  }
  const kV = keyframe.value

  keyframe.value = isArray(kV)
    ? kV.map((v) => setUnit(key, v, prop))
    : isString(kV) || isNumber(kV)
      ? setUnit(key, kV, prop)
      : (kV as any)

  return keyframe
}

export function generateKeyframes(
  options: AnimationOptions,
): GeneratedKeyframe[] {
  const {
    autoplay,
    flow,
    id,
    direction,
    duration = 0.6,
    delay,
    endDelay,
    playRate,
    repeat,
    repeatStart,
    ease,
    fillMode,
    composite,
    pseudoElement,
    repeatComposite,
    offset,
    driver,
    start,
    end,
    ...props
  } = options

  const keys = Object.keys(props) as (keyof AnimationOptionsKeyframes)[]
  const keyframes: GeneratedKeyframe[] = []
  const transforms: GeneratedKeyframe[] = []
  const effect: AnimationOptionsEffect = {
    ...config.animation,
    ...parseEffect({
      id,
      direction,
      duration,
      delay,
      endDelay,
      playRate,
      repeat,
      repeatStart,
      ease,
      fillMode,
      composite,
      pseudoElement,
      repeatComposite,
      offset,
      start,
      end,
    }),
  }

  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    const value = props[key]

    if (rgxIsTransform.test(key)) {
      let k: string = key
      if (k.length === 1) k = `translate${key.toUpperCase()}`

      const keyframe = parseKeyframeValue(k, value, effect, 'transform')
      const comp = keyframe.composite || composite || 'add'
      keyframe.effect.composite = comp as any

      transforms.push({
        ease,
        ...keyframe,
        composite: comp,
      })
    } else if (!key.startsWith('on')) {
      keyframes.push({
        ease,
        composite,
        ...parseKeyframeValue(key, value, effect),
      })
    }
  }

  transforms.sort(
    (a, b) =>
      ((a.effect?.duration as number) ?? 0) -
      ((b.effect?.duration as number) ?? 0),
  )

  return [...transforms, ...keyframes]
}

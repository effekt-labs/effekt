import { isNumber, isString, isArray, isObject, composeRegex } from '@/shared'
import type {
  AnimationOptions,
  AnimationKeyframes,
  GeneratedKeyframe,
} from './types'

const rgxPxOther = /(width|height|margin|padding|inset|top|right|bottom|left)/i
const rgxPxTransform = /^(x|y|z|translate|perspective)/
const rgxDegTransform = /^(rotate|skew)/
const rgxUnitlessTransform = /^scale/
const rgxPxAll = composeRegex(rgxPxTransform, rgxPxOther)
const rgxIsTransform = composeRegex(
  rgxPxTransform,
  rgxDegTransform,
  rgxUnitlessTransform,
)

const parseObjectValue = (
  value: AnimationKeyframes[keyof AnimationKeyframes],
) => (isObject(value) && !isArray(value) && value) || { value }

const setUnit = (key: string, value: number | string, prop: string): string => {
  let unit = isNumber(value)
    ? (rgxPxAll.test(key) && 'px') || (rgxDegTransform.test(key) && 'deg') || ''
    : ''
  return prop === 'transform' ? `${key}(${value}${unit})` : `${value}${unit}`
}

const parseKeyframeValue = (key: string, options: GeneratedKeyframe): void => {
  const { key: prop, value } = options

  options.value = isArray(value)
    ? value.map((v) => setUnit(key, v, prop))
    : isString(value) || isNumber(value)
      ? setUnit(key, value, prop)
      : (value as any)
}

export function generateKeyframes(
  options: AnimationOptions,
): GeneratedKeyframe[] {
  const {
    autoplay,
    commitStyles,
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
    timeline,
    offset,
    rangeStart,
    rangeEnd,
    ...props
  } = options

  const keys = Object.keys(props) as (keyof AnimationKeyframes)[]
  const keyframes: GeneratedKeyframe[] = []
  const transforms: GeneratedKeyframe[] = []
  const effect = {
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
    rangeStart,
    rangeEnd,
  }

  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    const value = props[key]

    if (rgxIsTransform.test(key)) {
      let k: string = key
      if (k.length === 1) k = `translate${key.toUpperCase()}`

      const keyframe: GeneratedKeyframe = {
        ...effect,
        composite: 'add',
        ...parseObjectValue(value),
        key: 'transform',
      }

      parseKeyframeValue(k, keyframe)
      transforms.push(keyframe)
    } else if (!key.startsWith('on')) {
      const keyframe: GeneratedKeyframe = {
        ...effect,
        ...parseObjectValue(value),
        key,
      }

      parseKeyframeValue(key, keyframe)
      keyframes.push(keyframe)
    }
  }

  transforms.sort((a, b) => (a.duration as number) - (b.duration as number))

  return [...transforms, ...keyframes]
}

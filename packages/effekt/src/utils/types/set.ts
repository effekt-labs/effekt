import type {
  AnimationKeyframesOther,
  AnimationKeyframesTransform,
  AnimationKeyframesColor,
} from '@/animation/types'

type SetValues<T, Values> = {
  [K in keyof T]: Values
}

export type SetOptions = SetValues<AnimationKeyframesOther, number | string> &
  SetValues<AnimationKeyframesTransform, number | string> &
  SetValues<AnimationKeyframesColor, string>

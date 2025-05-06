import type {
  AnimationOptionsKeyframes,
  AnimationKeyframesOther,
  AnimationKeyframesTransform,
  AnimationKeyframesColor,
} from '@/animation/types'
import type { SetRecordValues } from '@/shared/types'

export interface GeneratedSetKeyframe {
  key: string
  value: AnimationOptionsKeyframes[keyof AnimationOptionsKeyframes]
}

export type SetOptions = SetRecordValues<
  AnimationKeyframesOther,
  number | string
> &
  SetRecordValues<AnimationKeyframesTransform, number | string> &
  SetRecordValues<AnimationKeyframesColor, string> & {
    willChange: string
  }

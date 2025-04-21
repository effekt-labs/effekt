import type {
  AnimationKeyframesOther,
  AnimationKeyframesTransform,
  AnimationKeyframesColor,
} from '@/animation/types'
import type { SetRecordValues } from '@/shared/types'

export type SetOptions = SetRecordValues<
  AnimationKeyframesOther,
  number | string
> &
  SetRecordValues<AnimationKeyframesTransform, number | string> &
  SetRecordValues<AnimationKeyframesColor, string>

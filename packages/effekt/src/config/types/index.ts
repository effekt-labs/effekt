import type {
  AnimationOptions,
  AnimationOptionsEffect,
} from '@/animation/types'

type ConfigAnimation = Omit<AnimationOptionsEffect, 'driver'> &
  Pick<AnimationOptions, 'autoplay' | 'flow' | 'offset'>

type ConfigFrame = { fps?: number | false }

export interface EffektConfig {
  /**
   * Animation global options.
   */
  animation?: ConfigAnimation
  /**
   * Frame global options.
   */
  frame?: ConfigFrame
}

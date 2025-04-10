import type { AnimationOptions, AnimationEffect } from '@/animation/types'

type ConfigAnimation = Omit<AnimationEffect, 'driver'> &
  Pick<AnimationOptions, 'autoplay' | 'flow' | 'offset'>

type ConfigFrame = { fps?: number }

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

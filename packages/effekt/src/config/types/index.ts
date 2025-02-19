import type { AnimationOptions, AnimationEffect } from '@/animation/types'

type ConfigAnimation = Omit<AnimationEffect, 'timeline'> &
  Pick<AnimationOptions, 'autoplay' | 'commitStyles' | 'offset'>

type ConfigFrame = { fps?: number }

export interface EffektConfig {
  animation?: ConfigAnimation
  frame?: ConfigFrame
}

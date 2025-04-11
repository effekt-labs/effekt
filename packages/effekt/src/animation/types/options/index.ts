export * from './shared'
export * from './effect'
export * from './events'
export * from './custom'
export * from './keyframes'

import {
  AnimationOptionsEvents,
  AnimationOptionsEffect,
  AnimationOptionsCustom,
  AnimationOptionsKeyframes,
} from './'

export type AnimationOptions = AnimationOptionsEffect &
  AnimationOptionsEvents &
  AnimationOptionsCustom &
  AnimationOptionsKeyframes

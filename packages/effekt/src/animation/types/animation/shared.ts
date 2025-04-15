export type AnimationTarget = string | Element | null

export type AnimationTargets =
  | string
  | Element
  | null
  | (Element | null)[]
  | NodeListOf<Element>

export type AnimationPromise = Promise<WebAnimation[]>

export type AnimationDriver = globalThis.AnimationTimeline | null

export type AnimationEffect = globalThis.AnimationEffect | null

export type AnimationPlayState = globalThis.AnimationPlayState

export type AnimationPropertyNames =
  | 'startTime'
  | 'currentTime'
  | 'playbackRate'
  | 'effect'
  | 'timeline'

export type AnimationEventNames =
  | 'play'
  | 'pause'
  | 'reverse'
  | 'cancel'
  | 'finish'

export type WebAnimation = globalThis.Animation

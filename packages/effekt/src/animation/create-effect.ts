import { secToMs } from '@/utils'
import { isArray, setRepeat, setEasing } from '@/shared'
import type { AnimationOptionsEffect, GeneratedKeyframe } from './types'

export function createEffect(
  effect: AnimationOptionsEffect,
): GeneratedKeyframe['effect'] {
  const {
    id,
    direction,
    duration,
    delay,
    endDelay,
    playRate: playbackRate,
    repeat = 0,
    repeatStart: iterationStart,
    ease,
    fillMode = 'both',
    composite,
    pseudoElement,
    repeatComposite: iterationComposite,
    start: rangeStart,
    end: rangeEnd,
  } = effect

  return {
    id,
    direction,
    duration: secToMs(duration!),
    delay,
    endDelay,
    playbackRate,
    iterations: setRepeat(repeat),
    iterationStart,
    easing: !isArray(ease) ? setEasing(ease) : undefined,
    fill: fillMode,
    composite: !isArray(composite) ? composite : undefined,
    pseudoElement,
    iterationComposite,
    rangeStart,
    rangeEnd,
  } as GeneratedKeyframe['effect']
}

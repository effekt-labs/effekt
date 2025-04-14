import { isUndefined, setUnit, rgxIsTransform } from '@/shared'
import { getElements } from './get-elements'
import type { AnimationTargets, GeneratedKeyframe } from '@/animation/types'
import type { SetOptions } from './types'

const generateSetKeyframes = (options: SetOptions): GeneratedKeyframe[] => {
  const keyframes: GeneratedKeyframe[] = []
  const transforms: string[] = []

  for (const [key, value] of Object.entries(options)) {
    if (rgxIsTransform.test(key)) {
      let k: string = key
      if (k.length === 1) k = `translate${key.toUpperCase()}`

      transforms.push(setUnit(k, value, 'transform'))
    } else {
      keyframes.push({
        key,
        value: setUnit(key, value),
      })
    }
  }

  if (transforms.length) {
    keyframes.push({
      key: 'transform',
      value: transforms.join(' '),
    })
  }

  return keyframes
}

/**
 * Sets initial styles to specified DOM elements.
 *
 * Ideal for applying dynamic or baseline values needed for further animations, transitions, or interactive behaviors.
 *
 * @example
 *
 * ```ts
 * import { set } from 'effekt/utils'
 *
 * set('.el', {
 *   x: 300,
 *   background: '#0df',
 * })
 * ```
 */
export function set(targets: AnimationTargets, options: SetOptions): void {
  const els = getElements(targets)
  if (!els.length) return

  const keys = new WeakMap<Element, GeneratedKeyframe[]>([
    [els[0], generateSetKeyframes(options)],
  ])

  for (let i = 0, l = els.length; i < l; i++) {
    const el = els[i] as HTMLElement

    for (let kI = 0, kL = keys.get(els[0])!.length; kI < kL; kI++) {
      const { key, value } = keys.get(els[0])![kI]
      const p = key as any
      if (!isUndefined(el.style[p])) el.style[p] = `${value}`
    }
  }
}

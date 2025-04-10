import type { EffektConfig } from './types'

export const config: EffektConfig = {
  animation: {
    autoplay: true,
    flow: 'complete',
  },
  frame: {
    fps: 60,
  },
}

/**
 * Defines global configuration via custom `options` object that contains all available settings, which can be applied fully or selectively.
 *
 * It’s recommended to define this once, before using other code to ensure consistent and accurate settings.
 *
 * Also, globals can be overridden by defining local custom settings.
 *
 * @example
 *
 * ```ts
 * import { defineConfig } from 'effekt'
 *
 * // Updates the global `Effekt` configuration
 * defineConfig({
 *   animation: {
 *     duration: 1,
 *     // ...
 *   },
 * })
 * ```
 */
export function defineConfig(options: EffektConfig = {}): EffektConfig {
  if (!options) return config
  return (Object.keys(config) as (keyof EffektConfig)[]).reduce(
    (_, k) => ((config[k] = { ...config[k], ...options[k] }), config),
    {} as EffektConfig,
  )
}

export interface ScrollDriverOptions {
  /**
   * Specifies a custom container whose scroll position will be monitored.
   *
   * @default document.documentElement
   */
  container?: Element
  /**
   * Specifies a custom target whose scroll position will be monitored relative to the viewport.
   *
   * @default undefined
   */
  target?: Element
  /**
   * Specifies the custom scroll axis, the direction in which scrolling will progress.
   *
   * - Vertical: `y`
   * - Horizontal: `x`
   *
   * @default 'y'
   */
  axis?: 'y' | 'x'
  /**
   * Specifies the detection boundary offset relative to the viewport's edge for early/late triggering.
   *
   * @default undefined
   */
  inset?: string
}

export type ScrollDriver<T extends ScrollDriverOptions = ScrollDriverOptions> =
  T['target'] extends Element
    ? globalThis.ViewTimeline
    : globalThis.ScrollTimeline

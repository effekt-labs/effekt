export type InViewCallback = (entry: IntersectionObserverEntry) => void

export type InView = () => void

type RootMarginString = `${number}${'px' | '%'}`
export type RootMargin =
  | RootMarginString
  | `${RootMarginString} ${RootMarginString}`
  | `${RootMarginString} ${RootMarginString} ${RootMarginString}`
  | `${RootMarginString} ${RootMarginString} ${RootMarginString} ${RootMarginString}`

export interface InViewOptions {
  /**
   * Specifies the element to be used as the viewport for detecting the visibility of the target element.
   *
   * The root element must be an ancestor of the target. If not provided or set to null, the browser's viewport will be used.
   *
   * @default undefined
   */
  root?: Document | Element | null
  /**
   * Specifies the margin around the `root` element. This value is a string with up to four values, similar to CSS margin property.
   *
   * The values can be in absolute lengths (`px`) or percentages (`%`), and they define the expansion or shrinkage of the root's bounding box.
   *
   * Negative values will shrink the root's bounding box, while positive values will expand it.
   *
   * @default '0px 0px 0px 0px'
   */
  margin?: RootMargin
  /**
   * Specifies a single number or an array of numbers indicating the percentage of the target's visibility required to trigger the observer's callback.
   *
   * - `0` means the callback is triggered as soon as any part of the target is visible.
   * - `0.5` means the callback will trigger when 50% of the target is visible.
   * - `1` means the callback will only be triggered when the entire target is fully visible.
   *
   * If an array is provided, the callback will be triggered whenever the target's visibility crosses any of the specified thresholds.
   *
   * @default 0
   */
  threshold?: number | number[]
}

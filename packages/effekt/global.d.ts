type TimelineAxis = 'block' | 'inline' | 'x' | 'y'

declare global {
  //
  // Polyfill types for ScrollTimeline
  //
  // NOTE: This is for development only to ensure type safety and avoid potential issues in TypeScript projects.
  // Also, native support is already great, so it’s just a matter of time before it’s fully integrated into browsers as part of the global API.
  //
  // @experimental Browser support (2025): 74.8%
  //
  // @see https://developer.mozilla.org/en-US/docs/Web/API/ScrollTimeline
  //
  class ScrollTimeline {
    constructor(options: { source: Element; axis?: TimelineAxis })

    get currentTime(): globalThis.CSSUnitValue | null
    get duration(): globalThis.CSSUnitValue | null
    get source(): Readonly<Element>
    get axis(): Readonly<TimelineAxis>
  }

  //
  // Polyfill types for ViewTimeline
  //
  // NOTE: This is for development only to ensure type safety and avoid potential issues in TypeScript projects.
  // Also, native support is already great, so it’s just a matter of time before it’s fully integrated into browsers as part of the global API.
  //
  // @experimental Browser support (2025): 74.8%
  //
  // @see https://developer.mozilla.org/en-US/docs/Web/API/ViewTimeline
  //
  class ViewTimeline extends ScrollTimeline {
    constructor(options: {
      subject: Element
      axis?: TimelineAxis
      inset?:
        | 'auto'
        | string
        | (
            | [string | globalThis.CSSNumericValue]
            | [
                string | globalThis.CSSNumericValue,
                string | globalThis.CSSNumericValue,
              ]
          )
    })

    get subject(): Readonly<Element>
    get startOffset(): Readonly<globalThis.CSSNumericValue>
    get endOffset(): Readonly<globalThis.CSSNumericValue>
  }
}

export {}

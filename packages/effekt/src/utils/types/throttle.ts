export interface ThrottleOptions {
  /**
   * Specifies the minimum time (in milliseconds) between successive executions of the callback.
   */
  delay: number
  /**
   * Specifies whether the callback should be executed immediately on the leading edge of the throttle period.
   *
   * @default true
   */
  leading?: boolean
  /**
   * Specifies whether a call made during the throttle period should be executed once more on the trailing edge.
   *
   * @default true
   */
  trailing?: boolean
}

export type Throttle<T extends any[], R> = {
  (...args: T): R | undefined
  isThrottled(): boolean
  trigger(...args: T): R
  flush(): R | undefined
  cancel(): void
}

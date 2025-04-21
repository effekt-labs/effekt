export interface DebounceOptions {
  /**
   * Specifies the time (in milliseconds) that must elapse after the most recent call before the callback is executed.
   */
  delay: number
  /**
   * Specifies whether the callback should be executed immediately on the leading edge of the debounce period.
   *
   * If enabled, the callback is invoked immediately on the first call, then further calls are delayed until after the specified delay.
   *
   * @default undefined
   */
  leading?: boolean
  /**
   * Specifies whether the callback should be executed on the trailing edge after the debounce period.
   *
   * @default true
   */
  trailing?: boolean
}

export type Debounce<T extends any[], R> = {
  (...args: T): R | undefined
  isPending(): boolean
  flush(...args: T): R | undefined
  cancel(): void
}

/**
 * Schedules the execution of a callback to run on the next event loop cycle.
 *
 * Ensures the callback is executed after the current call stack has cleared and after the current frame has been rendered,
 * effectively allowing you to defer execution of the callback until the next event loop.
 *
 * Use Cases:
 *
 * - Deferring an operation until after the DOM has been painted.
 * - Allowing the browser to complete its current tasks (e.g., rendering).
 * - Providing an easy way to execute a task asynchronously but **immediately** after the current operation.
 * - Ensuring smooth animation frame updates: Using `nextTick` to queue updates after a frame,
 * ensuring that changes are applied in sync with the next rendering cycle.
 * - Preventing blocking of UI updates: Using `nextTick` to offload heavy tasks,
 * allowing the browser to maintain smooth animations and avoid frame drops.
 *
 * @example
 *
 * ```ts
 * import { nextTick } from 'effekt/utils'
 *
 * nextTick(() => {
 *   console.log('This runs after the current event loop, after the DOM paint.');
 * })
 * ```
 */
export function nextTick(callback: VoidFunction): void {
  setTimeout(callback, 0)
}

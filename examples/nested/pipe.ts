/**
 * @example Test 1
 * ```ts
 * import { pipe } from './pipe'
 * import * as assert from "assert";
 * 
 * assert.equal(pipe('1', '2', '3'), undefined)
 * ```
 * @example Test 2
 * ```ts
 * import { pipe } from './pipe'
 * import * as assert from "assert";
 * 
 * assert.equal(pipe('1'), undefined)
 * ```
 */
export function pipe(...args: unknown[]) {
  return undefined
}
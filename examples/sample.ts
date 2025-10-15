/**
 * @example
 * ```
 * import { sum } from "./sample";
 *
 * assert.equal(sum(4, 5), 9);
 * ```
 */
export function sum(a: number, b: number) {
  return a + b
}

/**
 * sub function
 *
 * @remarks
 * demo
 *
 * @example custom name here
 *
 * ```
 * import * as assert from "assert";
 * import { sub } from "./sample";
 *
 * assert.equal(sub(2, 1), 1);
 * ```
 *
 * @example
 *
 * ```
 * import * as assert from "assert";
 * import fs from "node:fs";
 * import path, { resolve } from "node:path";
 * import './side-effects'
 * import { sub } from "./sample";
 *
 * assert.equal(sub(4, 5), -1);
 * ```
 */
export function sub(a: number, b: number) {
  return a - b
}

/**
 * Sub prop is 12
 * @example sub prop is 12
 * ```ts
 * assert.equal(sub.prop, 12)
 * ```
 */
sub.prop = 12

/**
 * duck class
 */
export class Duck {
  /**
   * @example class method example
   *
   * ```
   * import * as assert from "assert";
   * import { Duck } from "./sample";
   *
   * const duck = new Duck();
   * assert.equal(duck.quack(), "quack");
   * ```
   *
   */
  quack() {
    return "quack"
  }

  /**
   * @example This test is skipped {@skipTest}
   * ```
   * // below code not appear on tests.
   * duck.ignore()
   * ```
   */
  ignore() {
    return "quack"
  }
}

export interface Formatter {
  /**
   * @example
   * ```ts
   * import { formatter } from "./sample";
   * assert.equal(formatter.formatYear(2022), '2022')
   * ```
   */
  formatYear: (year: number) => string
}
export const formatter: Formatter = {
  formatYear: (year: number) => `${year}`,
}

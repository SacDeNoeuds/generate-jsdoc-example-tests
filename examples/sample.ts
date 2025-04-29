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
 * @example
 * {@exampleName custom name here}
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
 * import { sub } from "./sample";
 *
 * assert.equal(sub(4, 5), -1);
 * ```
 */
export function sub(a: number, b: number) {
  return a - b
}

/**
 * duck class
 */
export class Duck {
  /**
   * @example
   * {@exampleName class method example}
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

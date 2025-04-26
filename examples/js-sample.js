/**
 * sum function
 *
 * @remarks
 * demo
 *
 * @example
 *
 * ```
 * import * as assert from "assert";
 * import { sum } from "./sample";
 *
 * assert.equal(sum(2, 1), 3);
 * ```
 *
 * @example
 * {@exampleName customTag}
 * ```
 * import * as assert from "assert";
 * import { sum } from "./sample";
 *
 * assert.equal(sum(4, 5), 9);
 * ```
 *
 * @param a
 * @param b
 */
export function sum(a, b) {
  return a + b;
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
 * @param a
 * @param b
 */
export function sub(a, b) {
  return a - b;
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
   * @example
   * ```
   * // below code not appear on tests.
   * duck.ignore()
   * ```
   * @example {@skipTest}
   * ```
   * // below code not appear on tests.
   * assert.equal(duck.ignore())
   * ```
   */
  ignore() {
    return "quack"
  }
}

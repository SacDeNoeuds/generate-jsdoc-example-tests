import * as tsdoc from "@microsoft/tsdoc"
import { strict as assert } from "assert"
import * as ts from "typescript"
import { test } from "vitest"
import { collectExampleCodes, extractComments, parseTSDoc } from "../parser.js"
import { createVirtualSource } from "./helper.js"

test("extractComments single case", () => {
  const source = createVirtualSource({
    src: `/**
 * Test function
 *
 * @example
 *
 * \`\`\` 
 * test()
 * \`\`\`
 */
export function test() {
  // test
  console.log("hello");
}
    `,
    fileName: "virtual.ts",
  })

  const foundComments = extractComments(source)
  assert(ts.isFunctionDeclaration(foundComments[0].compilerNode))
})

test("extractComments multi declare", () => {
  const source = createVirtualSource({
    src: `/**
 * Test function
 *
 * @example
 *
 * \`\`\` 
 * test()
 * \`\`\`
 */
export function test() {
  // test
  console.log("hello");
}

/**
 * Test function2
 *
 * @example
 *
 * \`\`\` 
 * test2()
 * \`\`\`
 */
export const test2 = () => {}
    `,
    fileName: "virtual.ts",
  })

  const foundComments = extractComments(source)

  assert.equal(foundComments.length, 2)
  assert(ts.isVariableStatement(foundComments[1].compilerNode))
})

test("extractComments class", () => {
  const source = createVirtualSource({
    src: `/**
* Test class
*
* @example
*
* \`\`\` 
* const test = new TestClass()
* \`\`\`
*/
class TestClass {
  /**
   * Test function
   *
   * @example
   *
   * \`\`\` 
   * const test = new TestClass();
   * test.fn();
   * \`\`\`
   */
  fn() {}
}
    `,
    fileName: "virtual.ts",
  })

  const foundComments = extractComments(source)

  assert.equal(foundComments.length, 2)
  assert(ts.isMethodDeclaration(foundComments[1].compilerNode))
})

test("parseTSDoc", () => {
  const source = createVirtualSource({
    src: `
    /**
 * Test function
 *
 * @example
 *
 * \`\`\` 
 * test()
 * test()
 * \`\`\`
 */
export function test() {
  // test
  console.log("hello");
}
    `,
    fileName: "virtual.ts",
  })

  const foundComments = extractComments(source)
  const docNode = parseTSDoc(foundComments[0])
  const paragraph =
    docNode.summarySection.getChildNodes()[0] as tsdoc.DocParamCollection
  assert.equal(
    (paragraph.getChildNodes()[0] as tsdoc.DocPlainText).text,
    "Test function",
  )
})

test("collectExampleCodes", () => {
  const source = createVirtualSource({
    src: `/**
 * Test function
 *
 * @example
 *
 * \`\`\` 
 * import { test1 } from "test-mod"
 * test()
 * test()
 * \`\`\`
 */
export function test() {
  // test
  console.log("hello");
}

/**
 * Test function2
 *
 * @example
 *
 * \`\`\` 
 * import { test2 } from "test-mod"
 * assert.equal(test2(), true)
 * \`\`\`
 */
export function test2() {
  // test
  console.log("hello");
}

    `,
    fileName: "virtual.ts",
  })

  const foundComments = extractComments(source)
  const docNode = parseTSDoc(foundComments[1])
  const examples = collectExampleCodes(
    foundComments[1].compilerNode,
    source,
    docNode,
    { includeExampleContaining: ["assert."] },
  )
  assert.equal(
    examples[0].code,
    `import { test2 } from "test-mod"
assert.equal(test2(), true)
`,
  )
})

test("customTags", () => {
  const source = createVirtualSource({
    src: `/**
 * Test function
 *
 * @example
 * {@exampleName customtagTest}
 * \`\`\`ts
 * import { test1 } from "test-mod"
 * assert.equal(test(), true)
 * \`\`\`
 */
export function test() {
  // test
  console.log("hello");
}
    `,
    fileName: "virtual.ts",
  })

  const foundComments = extractComments(source)
  const docNode = parseTSDoc(foundComments[0])
  const examples = collectExampleCodes(
    foundComments[0].compilerNode,
    source,
    docNode,
    { includeExampleContaining: ["assert."] },
  )
  assert.equal(examples[0].name, "customtagTest")
  assert.equal(
    examples[0].code,
    `import { test1 } from "test-mod"
assert.equal(test(), true)
`,
  )
})

test("ignore", () => {
  const source = createVirtualSource({
    src: `/**
 * Test function
 *
 * @example
 * {@ignoreExample}
 *
 * \`\`\` 
 * import { test1 } from "test-mod"
 * test()
 * test()
 * \`\`\`
 */
export function test() {
  // test
  console.log("hello");
}
    `,
    fileName: "virtual.ts",
  })

  const foundComments = extractComments(source)
  const docNode = parseTSDoc(foundComments[0])
  const examples = collectExampleCodes(
    foundComments[0].compilerNode,
    source,
    docNode,
    { includeExampleContaining: ["assert."] },
  )

  assert.equal(examples.length, 0)
})

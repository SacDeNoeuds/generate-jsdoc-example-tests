import { strict as assert } from "assert"
import { test } from 'vitest'
import { wrapTestFunction } from "../funcwrapper.js"
import { splitImport } from "../import.js"
import { print } from "../printer.js"
import { createVirtualSource } from "./helper.js"

test("print ast", async () => {
  const source = createVirtualSource({
    src: `import { a, b } from "moduleA";
a();
b();
`,
    fileName: "virtual.ts"
  });

  const { body } = splitImport(source);

  const ast = wrapTestFunction("aaa", body, { testFunctionName: 'test' });

  assert.equal(
    await print(ast, { testFunctionName: 'test' }),
    `test('aaa', () => {
  a()
  b()
})
`
  );
});

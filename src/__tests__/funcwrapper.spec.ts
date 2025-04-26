import { strict as assert } from "assert"
import { test } from 'vitest'
import { wrapTestFunction } from "../funcwrapper"
import { splitImport } from "../import"
import { print } from "../printer"
import { createVirtualSource } from "./helper"

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

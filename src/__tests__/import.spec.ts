import { strict as assert } from "assert"
import * as ts from "typescript"
import { test } from 'vitest'
import { mergeImports, splitImport } from "../import"
import { print } from "../printer"
import { createVirtualSource } from "./helper"

test("split imports", async () => {
  const source = createVirtualSource({
    src: `
import { a, b } from "moduleA";
a();
b();
`,
    fileName: "virtual.ts"
  });

  const { imports, body } = splitImport(source);

  const res = createVirtualSource({ src: "", fileName: "b" });
  const ast = ts.factory.updateSourceFile(res, body);

  assert.equal(
    await print(ast, { testFunctionName: 'test' }),
    `a()
b()
`
  );

  const importSource = createVirtualSource({ src: "", fileName: "forassert" });
  const importAST = ts.factory.updateSourceFile(
    importSource,
    imports as Array<ts.Statement>
  );

  assert.equal(
    await print(importAST, { testFunctionName: 'test' }),
    `import { a, b } from 'moduleA'
`
  );
});

async function mergeImportsRunner(params: { src: string, expect: string }) {
  const { src, expect } = params;
  const source = createVirtualSource({
    src,
    fileName: "virtual.ts"
  });
  const { imports } = splitImport(source);
  const results = mergeImports(imports);
  const importSource = createVirtualSource({ src: "", fileName: "forassert" });
  const importAST = ts.factory.updateSourceFile(
    importSource,
    results as Array<ts.Statement>
  );
  assert.equal(await print(importAST, { testFunctionName: 'test' }), expect);
}

test("merge imports", async () => {
  await mergeImportsRunner({
    src: `import { a, b } from "moduleA";
import { b, c } from "moduleA";`,
    expect: `import { a, b, c } from 'moduleA'
`
  });
});

test("merge imports (multi module)", async () => {
  await mergeImportsRunner({
    src: `import { a, b } from "moduleA";
import { b, c } from "moduleA";
import { d, e } from "moduleB";
`,
    expect: `import { a, b, c } from 'moduleA'
import { d, e } from 'moduleB'
`
  });
});

test("as alias imports", async () => {
  await mergeImportsRunner({
    src: `import { a as alias, b as balias } from "moduleA";
import { b as balias, c } from "moduleA";,
`,
    expect: `import { a as alias, b as balias, c } from 'moduleA'
`
  });
});

test("named imports + identifier", async () => {
  await mergeImportsRunner({
    src: `import React, { useCallback } from "react";
import React, { useState, useCallback } from "react";
`,
    expect: `import React, { useCallback, useState } from 'react'
`
  });
});

test("default imports + named imports", async () => {
  await mergeImportsRunner({
    src: `import * as ts from "typescript";
import { createIdentifier, Node } from "typescript";
`,
    expect: `import * as ts from 'typescript'
import { createIdentifier, Node } from 'typescript'
`
  });
});

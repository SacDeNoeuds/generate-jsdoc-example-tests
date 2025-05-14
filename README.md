# generate-jsdoc-example-tests

Generate test files from your JSDoc @example comments. See configuration details in the [vitest](#vitest) cookbook and adapt it to your favorite test runner 😊.

**It offers you the certainty that your JSDoc @example are valid.**

## Why – TL;DR

Full announcement [here](https://sacdenoeuds.github.io/generate-jsdoc-example-tests/2025-04-announcement.html).

I love documenting my functions using JSDoc examples – imo example are the best doc one can have! – but I was tired of my doc getting obsolete. And tests don't provide in-IDE doc, so I figured: why not reconcile the 2 ?<br>
Write JSDoc examples, and generate tests from them…
1. To make sure examples never go obsolete 😍.
2. … And to test my stuff like I would anyway, you sillies 🤓

So here comes… generate-jsdoc-example-tests 🎉.

<details>
<summary>Prior art</summary>

- [tsdoc-testify](https://github.com/akito0107/tsdoc-testify) – see [Thanks](#thanks). Very old and unmaintained project, an excellent base to build this one 😁.
- [jsdoc-spec](https://github.com/AT-290690/jsdoc-spec) – both an example parser _and_ the test runner, without the test runner goodies.
- [ts-docs](https://ts-docs.github.io/ts-docs/pages/Guides/Documentation%20Tests.html) – same, on the test side, it is both an example parser _and_ a test runner, without the test runner goodies. Stuck to TypeScript v4.

</details>


## Installation

```sh
npm i -D generate-jsdoc-example-tests

# or directly via npx without installation:
npx generate-jsdoc-example-tests
```


## Demo

You document your functions, methods, constants & classes, for coworkers or your future self, you get tests for free:

<details>
<summary>Documenting a function</summary>

```ts
// src/date-formatter.ts
/**
 * @example
 * ```ts
 * import { formatDateYear } from './date-formatter'
 * 
 * expect(formatDateYear(new Date('2026-01-01')).toBe('2026')
 * ```
 */
export function formatDateYear(date: Date) {…}
```

Generate tests:
```sh
npx gen-jet 'src/**' \
  --header 'import { expect, test } from "vitest"' \
  --test-file-extension '.example.test' # do not provide the `.ts` or `.js`
```

Generated test:
```ts
// src/date-formatter.example.test.ts
// DO NOT EDIT …
import { expect, test } from 'vitest' // the provided header
import { formatDateYear } from './date-formatter'

test('Example 1', () => {
  expect(formatDateYear(new Date('2026-01-01'))).toBe('2026')
})
```

</details>
<details>
<summary>Documenting a class</summary>

```ts
// src/date-formatter.ts
class DateFormatter {
  /**
   * @example
   * ```ts
   * import { DateFormatter } from './date-formatter'
   * 
   * const formatter = new DateFormatter()
   * expect(formatter.formatYear(new Date('2026-01-01')).toBe('2026')
   * ```
   */
  formatYear(date: Date) {…}
}
```

Generate tests:
```sh
npx gen-jet 'src/**' \
  --header 'import { expect, test } from "vitest"' \
  --test-file-extension '.example.test' # do not provide the `.ts` or `.js`
```

Generated test:
```ts
// src/date-formatter.example.test.ts
// DO NOT EDIT …
import { expect, test } from 'vitest' // the provided header
import { DateFormatter } from './date-formatter'

test('Example 1', () => {
  const formatter = new DateFormatter()
  expect(formatter.formatYear(new Date('2026-01-01'))).toBe('2026')
})
```

</details>
<details>
<summary>Documenting a constant</summary>

```ts
// src/date-formatter.ts
/**
 * @example
 * ```ts
 * import { formatDate, yearFormat } from './date-formatter'
 * 
 * const date = new Date('2026-01-01')
 * expect(formatDate(date, yearFormat)).toBe('2026')
 * ```
 */
export const yearFormat = 'YYYY'

export const formatDate = (date: Date, format: string): string => {…}
```

Generate tests:
```sh
npx gen-jet 'src/**' \
  --header 'import { expect, test } from "vitest"' \
  --test-file-extension '.example.test' # do not provide the `.ts` or `.js`
```

Generated test:
```ts
// src/date-formatter.example.test.ts
// DO NOT EDIT …
import { expect, test } from 'vitest' // the provided header
import { formatDate, yearFormat } from './date-formatter'


test('Example 1', () => {
  const date = new Date('2026-01-01')
  expect(formatDate(date, yearFormat)).toBe('2026')
})
```

</details>
<details>
<summary>Documenting an interface / a type</summary>

```ts
// src/date-formatter.ts
interface DateFormatter {
  /**
   * @example
   * ```ts
   * import { makeDateFormatter } from './date-formatter'
   * 
   * const formatter = makeDateFormatter()
   * expect(formatter.formatYear(new Date('2026-01-01')).toBe('2026')
   * ```
   */
  formatYear(date: Date): string
}

export const makeDateFormatter = (): DateFormatter => ({
  formatYear: () => {…},
})
```

Generate tests:
```sh
npx gen-jet 'src/**' \
  --header 'import { expect, test } from "vitest"' \
  --test-file-extension '.example.test' # do not provide the `.ts` or `.js`
```

Generated test:
```ts
// src/date-formatter.example.test.ts
// DO NOT EDIT …
import { expect, test } from 'vitest' // the provided header
import { makeDateFormatter } from './date-formatter'

test('Example 1', () => {
  const formatter = makeDateFormatter()
  expect(formatter.formatYear(new Date('2026-01-01'))).toBe('2026')
})
```

</details>

## Usage

### CLI

`gen-jet`: gen = **gen**erate ; jet = **J**sdoc + **E**xample + **T**ests.

```sh
$ npx gen-jet src/
$ npx gen-jet src/,other-root/

# Usage with options:
$ npx gen-jet src/ \
  --test-file-extension '.example.test' \
  --test-function-name 'it' \
  --header 'import { it, expect } from "vitest | jest | whatever"'
  --header 'import { myGlobalImport } from "~/some-global-stuff"'
  --include-example-containing expect,assert,assertStrict
  --watch

# For a full CLI usage, checkout
$ gen-jet --help
```

### Programmatic API

```ts
import { generateTests, type GenerateOptions } from 'generate-jsdoc-example-tests'

generateTests(['./src', './other-root'])  // the folders are resolved from process cwd.
  .then(() => console.info('tests generated'))
  .catch(console.error)

const myOptions: GenerateOptions = { … }

generateTests(['./src',], myOptions)
  .then(() => console.info('tests generated'))
  .catch(console.error)

```

### Vitest

```ts
import { generateTests } from 'generate-jsdoc-example-tests'

generateTests(['./src', './other-root'])  // the folders are resolved from process cwd.
  .then(() => console.info('tests generated'))
  .catch(console.error)

generateTests('./src', {
  testFileExtension: '.generated.test', // default is '.example.test' ; do not provide `.ts` or `.js`
  testFunctionName: 'it', // default is 'test'
  headers: ['import { it, expect } from "vitest"'],

  // keywords the JSDoc @example body must contain to be included in the generated tests.
  includeExampleContaining: ['expect('], // default is ['assert.', 'assert(', 'expect']
  watch: false, // <-- enable watch mode here.
})
  .then(() => console.info('tests generated'))
  .catch(console.error)
```

## FAQ

### Which tests are included ?

There is a `includeExampleContaining` option, defaulted to `['expect(', 'assert.', 'assert(']`.
Any `@example` content containing `expect(`, `assert.` or `assert(` will have a generated test.

If you want to omit a test, you can omit it with `@skipTest`:
```ts
/**
 * @example This one is included because it contains `expect`
 * ```ts
 * import { myFn } from './my-fn'
 * expect(myFn()).toBe(true)
 * ```
 * @example This is omitted because there is no `expect` or `assert`
 * ```ts
 * myFn('toto') // invalid arg.
 * ```
 * @example this one is explicitly omitted {@skipTest}
 * ```ts
 * import { myFn } from './my-fn'
 * expect(myFn()).toBe(false)
 * ```
 */
export const myFn = () => true
```

### Does it generate JS or TS files?

The test files are generated according to their source file:
- if the source file is JS, the generated test file will be JS.
- if the source file is TS, the generated test file will be TS.

### I want to name my examples

Your examples are named by default if you provide a title:

```ts
/**
 *          ⬇️ example title
 * @example sum 4 and 5
 * ```
 * import assert from "assert";
 * import { sum } from "./sample";
 *
 * assert.equal(sum(4, 5), 9);
 * ```
 */
export function sum() {…}
```

Generated test file:

```ts
import assert from "assert";
import { sum } from "./sample";

test("sum 4 and 5", () => {
  assert.equal(sum(4, 5), 9);
})
```

## Thanks

I based this work upon Akito Ito's awesome [tsdoc-testify](https://github.com/akito0107/tsdoc-testify) and pushed it further with options and test runner interop.

**Many MANY thanks to you [Akito Ito](https://github.com/akito0107) 🙏🙏**

## License

Same as the original one:

This project is licensed under the Apache License 2.0 License - see the [LICENSE](LICENSE) file for details

## Contributing

First of all, thank you deeply if you want to participate.
Please visit the [contributing](./CONTRIBUTING.md) section for a detailed guide (getting started, roadmap).

> If you like the project but don't have time to contribute, all good ! There are other ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Tweet (Bsky) about it
> - Refer this project in your project’s readme
> - Mention the project at local meetups and tell your friends/colleagues

# Contributing

First of all, thank you deeply if you want to participate.

FYI I am employed in a company and my time is limited.

I have a few features in mind which anyone can implement (see [#on my radar](#on-my-radar-when-i-have-time)).
If you have feature requests, please get in touch and let’s see what we can do about it.

Cheers!

> If you like the project but don't have time to contribute, all good ! There are other ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Tweet about it
> - Refer this project in your project’s readme
> - Mention the project at local meetups and tell your friends/colleagues

## Getting started

```sh
git clone https://github.com/SacDeNoeuds/generate-jsdoc-example-tests.git
cd generate-jsdoc-example-tests
npm ci

# Generate the examples:
npm run debug
```
That’s it, you’re all set!

## On my radar… when I have time

Contributions are especially welcome on that side as well.

Things I don’t have time to investigate but would love to have:

#### - [ ] Auto-generating the imports based on the example body – as long as exported in the same source file.

```ts
/**
 * @example
 * ```ts
 * // I would love to make this line unnecessary
 * import { formatDateYear } from './date-formatters'
 * 
 * assert.equal(formatDateYear(new Date('2026-01-01')), '2026')
 * ```
 */
export function formatDateYear(date: Date) {…}
```

#### - [ ] Providing config presets for popular test runners like vitest

```sh
# For instance, instead of this:
npx gen-jet 'src/**' --header 'import { it, expect } from "vitest"'

# I'd love to have something like this:
npx gen-jet 'src/**' --preset vitest
```

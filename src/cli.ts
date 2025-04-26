#!/usr/bin/env node
import { cac } from 'cac'
import { glob } from "glob"
import { readFileSync } from 'node:fs'
import * as path from "node:path"
import { fileURLToPath } from 'node:url'
import { generate } from "./app.js"

const currentFilePath = fileURLToPath(import.meta.url)
const packageJsonPath = path.resolve(path.dirname(currentFilePath), '../package.json')
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

const cli = cac(pkg.name)
// gen-jet

cli
  .version(pkg.version)
  .command('[pattern]', 'Generate tests from JSDoc @example')
  .usage("npx gen-jet './src/**/*.ts'")
  .option(
    '--test-function-name [name]',
    'Name of test function (default: "test")',
    { default: 'test' }
  )
  .option(
    '--test-file-extension [ext]',
    'Test file extension (default: ".example.test.ts")',
    { default: '.example.test.ts' }
  )
  .option(
    '--header [text]',
    'Header text to include in test files, ie: `import { test } from "vitest"`',
    { default: '' }
  )
  .action(async (pattern, options) => {
    if (!pattern) {
      console.error('Error: Missing required glob pattern')
      cli.outputHelp()
      process.exit(1)
    }
    console.debug('Generating tests with:')
    console.debug({ pattern, options })
    try {
      const unfilteredFiles = await glob(pattern)
      const files = unfilteredFiles.filter((fileName) => !fileName.endsWith(options.testFileExtension))
      await Promise.all(files.map(async (f) => {
        const filePath = path.resolve(process.cwd(), f)
        await generate(filePath, options)
      }))
    } catch (error) {
      console.error(error)
    }
  })

cli.parse()

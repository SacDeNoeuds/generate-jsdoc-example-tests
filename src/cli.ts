#!/usr/bin/env node
import { cac } from 'cac'
import { readFileSync } from 'node:fs'
import * as path from "node:path"
import { fileURLToPath } from 'node:url'
import { generateTests } from "./app.js"

const currentFilePath = fileURLToPath(import.meta.url)
const packageJsonPath = path.resolve(path.dirname(currentFilePath), '../package.json')
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

const cli = cac('gen-jet')

cli
  .version(pkg.version)
  .command('[pattern]', 'Generate tests from JSDoc @example')
  .usage("npx gen-jet './src/**'")
  .option(
    '--test-function-name [name]',
    'Name of test function (default: "test")',
    { default: 'test' }
  )
  .option(
    '--test-file-extension [ext]',
    'Test file extension (default: ".example.test")',
    { default: '.example.test' }
  )
  .option(
    '--header [texts]',
    'Header texts to include in test files, ie: --header \'import { test } from "vitest" --header \'import …\'',
    { type: [String], default: [] }
  )
  .option(
    "--include-example-containing <strings>",
    'Only generate test files for examples including one of the given strings',
    { type: [String], default: ['assert', 'expect'] }
  )
  .action(async (pattern, options) => {
    if (!pattern) {
      console.error('Error: Missing required glob pattern')
      cli.outputHelp()
      process.exit(1)
    }
    console.debug('Generating tests from JSDoc @example')
    try {
      await generateTests(pattern, {
        headers: options.header,
        includeExampleContaining: options.includeExampleContaining,
        testFileExtension: options.testFileExtension,
        testFunctionName: options.testFunctionName
      })
    } catch (error) {
      console.error(error)
    }
  })

cli.help()
cli.parse()

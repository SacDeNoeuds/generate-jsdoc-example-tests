#!/usr/bin/env node
import { cac } from 'cac'
import { readFileSync } from 'node:fs'
import * as path from "node:path"
import { fileURLToPath } from 'node:url'
import { defaultOptions, generateTests } from "./app.js"

const currentFilePath = fileURLToPath(import.meta.url)
const packageJsonPath = path.resolve(path.dirname(currentFilePath), '../package.json')
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

const cli = cac('gen-jet')

cli
  .version(pkg.version)
  .command('[root directories (comma-separated)]', 'Generate tests from JSDoc @example')
  .usage("npx gen-jet src/,other-root/")
  .option(
    '--test-function-name [name]',
    'Name of test function (default: "test")',
    { default: defaultOptions.testFunctionName }
  )
  .option(
    '--test-file-extension [ext]',
    'Test file extension (default: ".example.test")',
    { default: defaultOptions.testFileExtension }
  )
  .option(
    '--header [texts]',
    'Header texts to include in test files, ie: --header \'import { test } from "vitest"\' --header \'import …\'',
    { type: [], default: defaultOptions.headers }
  )
  .option(
    "--include-example-containing <strings>",
    'Only generate test files for examples including one of the given strings',
    { type: [], default: defaultOptions.includeExampleContaining }
  )
  
  .option('--watch', 'Enable watch mode', {
    // @ts-ignore cac is badly typed, `type` does accept `Boolean`
    type: Boolean,
    default: defaultOptions.watch
  })
  .action(async (directoryInput, options) => {
    const rootDirectories = directoryInput?.split(',').filter(Boolean) ?? []
    if (rootDirectories.length === 0) {
      cli.outputHelp()
      console.info('\n')
      console.error('Error: Missing required root directories, see usage upper\n')
      process.exit(1)
    }
    console.debug('Generating tests from JSDoc @example')
    try {
      await generateTests(rootDirectories, {
        headers: options.header,
        includeExampleContaining: options.includeExampleContaining,
        testFileExtension: options.testFileExtension,
        testFunctionName: options.testFunctionName,
        watch: options.watch,
      })
    } catch (error) {
      console.error(error)
    }
  })

cli.help()
cli.parse()

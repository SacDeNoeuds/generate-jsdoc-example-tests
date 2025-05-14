// FIXME: in 2028, import `glob` from 'node:fs/promises' (introduced in v22)
// in the meantime, to support more node runtimes, let’s use the glob package.
import { watch } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import * as path from "node:path"
import * as ts from "typescript"
import { wrapTestFunction } from "./funcwrapper.js"
import { mergeImports, splitImport } from "./import.js"
import { collectExampleCodes, extractComments, parseTSDoc } from "./parser.js"
import { print } from "./printer.js"
import { readDirectories } from './read-directories.js'

export interface GenerateOptions {
  /** @default "test" */
  testFunctionName: string
  /** @default ".example.test" */
  testFileExtension: string
  /**
   * This is where you can adapt the generated code to your favorite test runner:
   *
   * For Jest, leave it empty, Jest adds its functions in the global scope
   *
   * For vitest, use `headers: ["import { test, expect } from 'vitest'", "…"]`
   */
  headers: string[]
  /**
   * Keywords the example body must contain to be included in the generated tests.
   * @default ['assert', 'expect']
   */
  includeExampleContaining: string[];
  /**
   * Enable watch mode
   * @default false
   */
  watch: boolean
}
export const defaultOptions: GenerateOptions = {
  testFunctionName: "test",
  testFileExtension: ".example.test",
  headers: [],
  includeExampleContaining: ['assert.', 'assert(', 'expect('],
  watch: false,
}

/**
 * Generate test files from JSDoc comments.
 * @example default
 * ```ts
 * import { generate } from "generate-jsdoc-example-tests"
 *
 * generate("./src/**")
 *   .then(() => console.info('tests generated'))
 *   .catch(console.error)
 * ```
 * @example with options for Vitest
 * ```ts
 * import { generate } from "generate-jsdoc-example-tests"
 *
 * generate("./src/**", {
 *   testFunctionName: 'it',
 *   headers: ['import { it, expect } from "vitest"'],
 *   testFileExtension: '.generated.test',
 *   includeExampleContaining: ['expect('],
 * })
 *   .then(() => console.info('tests generated'))
 *   .catch(console.error)
 * ```
 */
export async function generateTests(rootDirectories: string[], providedOptions?: Partial<GenerateOptions>) {
  const options = { ...defaultOptions, ...providedOptions }
  const allFiles = readDirectories(rootDirectories, { ignorePatterns: [options.testFileExtension] })
  for (const fileName of allFiles) {
    if (fileName.includes(options.testFileExtension)) continue
    await generateTestFile(fileName, options)
  }
  if (!options.watch) return
  
  const directories = rootDirectories.map((dir) => path.resolve(process.cwd(), dir))
  console.info('\n\nwatching changes in directories:\n-', directories.join('\n- '), '\n')

  const watchModeOptions = { ...options, watch: false }
  for (const directory of directories) {
    watch(directory, { recursive: true }, (_eventType, fileName) => {
      if (fileName.includes(options.testFileExtension)) return;
      console.info('change detected in', directory, 're-generating tests…')
      void generateTests([directory], watchModeOptions)
    })
  }
}

async function generateTestFile(
  filePath: string,
  options: GenerateOptions,
) {
  const { ext, name, dir } = path.parse(filePath)

  let kind
  switch (ext.toUpperCase()) {
    case ".TS":
      kind = ts.ScriptKind.TS
      break
    case ".JS":
      kind = ts.ScriptKind.JS
      break
    case ".TSX":
    case ".JSX":
      console.log("currently unsupported tsx ", filePath)
      return
    default:
      return
  }

  const source = ts.createSourceFile(
    filePath,
    await readFile(filePath, 'utf-8'),
    ts.ScriptTarget.Latest,
    false,
    kind,
  )

  const foundComments = extractComments(source)

  if (foundComments.length === 0) {
    // console.debug(`${filePath} comments not found`)
    return
  }

  const { imports, testBody } = foundComments
    .map((f) => {
      return { docNode: parseTSDoc(f), node: f.compilerNode }
    })
    .map(({ docNode, node }) => {
      return collectExampleCodes(node, source, docNode, options)
    })
    .flat()
    .map((example) => {
      return {
        ...example,
        exampleSource: ts.createSourceFile(
          example.name,
          example.code,
          ts.ScriptTarget.Latest,
          false,
          kind,
        ),
      }
    })
    .reduce(
      (acc, { /* source, */ exampleSource, name }) => {
        const { imports, body } = splitImport(exampleSource)

        // const fileName = path.relative(process.cwd(), source.fileName)
        const funcName = name || `Example ${++acc.counter}`

        const testBody = wrapTestFunction(funcName, body, options)
        return {
          ...acc,
          imports: [...acc.imports, ...imports],
          testBody: [...acc.testBody, testBody],
        }
      },
      { imports: [], testBody: [], counter: 0 },
    )

  const mergedImports = mergeImports(imports)

  if (testBody.length === 0) return // do not generate an empty test file.

  const ast = ts.factory.updateSourceFile(
    ts.createSourceFile(
      filePath + options.testFileExtension,
      "",
      ts.ScriptTarget.Latest,
      false,
      kind,
    ),
    [...mergedImports, ...testBody],
  )

  const banner = `// DO NOT EDIT: Code generated by "generate-jsdoc-example-tests".`
  if (options.headers.length > 0) options.headers.push('') // add empty line.
  const header = [banner, ...options.headers].filter(Boolean).join("\n")
  const printed = await print(ast, options)
  const result = `${header}\n${printed}`

  await writeFile(
    `${dir}/${name}${options.testFileExtension}${ext}`,
    result,
  )
}

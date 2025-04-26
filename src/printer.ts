import { format } from "prettier"
import * as ts from "typescript"

export async function print(ast: ts.Node): Promise<string> {
  const resultFile = ts.createSourceFile(
    "result.ts",
    "",
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  )
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    omitTrailingSemicolon: true,
  })
  const result = printer
    .printNode(ts.EmitHint.Unspecified, ast, resultFile)
    .replaceAll('\ntest(', '\n\ntest(')

  const formatted = await format(result, {
    parser: "typescript",
    semi: false,
    singleQuote: true,
  })
  return formatted
}

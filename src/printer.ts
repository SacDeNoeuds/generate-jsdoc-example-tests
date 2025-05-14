import * as path from 'node:path'
import * as prettier from "prettier"
import * as ts from "typescript"
import type { GenerateOptions } from "./app.js"

export async function print(
  ast: ts.Node,
  options: Pick<GenerateOptions, "testFunctionName">,
): Promise<string> {
  const resultFile = ts.createSourceFile(
    "result.ts",
    "",
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    omitTrailingSemicolon: true,
  });
  const result = printer
    .printNode(ts.EmitHint.Unspecified, ast, resultFile)
    .replaceAll(
      `\n${options.testFunctionName}(`,
      `\n\n${options.testFunctionName}(`,
    );

  const prettierConfig = await resolvePrettierConfig();
  const formatted = await prettier.format(result, {
    parser: "typescript",
    ...prettierConfig,
  });
  return formatted;
}

async function resolvePrettierConfig(): Promise<prettier.Options> {
  // NOTE: I am using readme instead of just `process.cwd()` because
  // `prettier.resolveConfig` inspects the directory of a file, not the directory directly.
  const pathOfReadme = path.resolve(process.cwd(), 'README.md')
  const maybeConfig = await prettier.resolveConfig(pathOfReadme);

  return (
    maybeConfig ?? {
      semi: false,
      singleQuote: true,
    }
  );
}

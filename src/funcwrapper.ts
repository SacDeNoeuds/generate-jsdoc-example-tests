import * as ts from "typescript"
import type { GenerateOptions } from './app.js'

export function wrapTestFunction(
  name: string,
  body: ts.Statement[],
  options: Pick<GenerateOptions, 'testFunctionName'>
): ts.Statement {
  const functionName = ts.factory.createIdentifier(options.testFunctionName);
  const caseName = ts.factory.createStringLiteral(name);
  const blockExpr = ts.factory.createBlock(body);

  const testBody = ts.factory.createArrowFunction(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    blockExpr
  );

  const testCaseAST = ts.factory.createCallExpression(functionName, undefined, [caseName, testBody]);

  return ts.factory.createExpressionStatement(testCaseAST);
}

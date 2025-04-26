import * as ts from "typescript"

export function wrapTestFunction(
  name: string,
  body: ts.Statement[]
): ts.Statement {
  const functionName = ts.factory.createIdentifier("test");
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

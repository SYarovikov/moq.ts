import { ExpectedExpressions, ExpectedNamedMethodExpression } from "../expected-expressions/expected-expressions";

export class ExpressionHasMethodExplorer {
    public has(name: PropertyKey, expression: ExpectedExpressions<unknown>): boolean {
        if (expression instanceof ExpectedNamedMethodExpression) {
            return expression.name === name;
        }

        return false;
    }
}

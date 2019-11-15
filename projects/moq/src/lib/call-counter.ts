import { ExpectedExpressions } from "./expected-expressions/expected-expressions";
import { Interactions } from "./interactions";
import { ExpressionMatcher } from "./expression-matchers/expression-matcher";

/**
 * @hidden
 */
export class CallCounter {

    constructor(private expressionMatcher: ExpressionMatcher = new ExpressionMatcher()) {

    }

    public count<T>(expected: ExpectedExpressions<T>, expressions: Interactions[]): number {
        let count = 0;
        for (const expression of expressions) {
            if (this.expressionMatcher.matched(expression, expected) === true) {
                count += 1;
            }
        }

        return count;
    }
}

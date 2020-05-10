import {ArgumentsMatcher} from "./arguments.matcher";
import {It} from "../expected-expressions/expression-predicates";
import {NamedMethodInteraction} from "../interactions";
import {NamedMethodExpressionMatcher} from "./instance-method.matcher";
import {ExpectedNamedMethodExpression} from "../expected-expressions/expected-expressions";

describe("Named method expression matcher", () => {

    function argumentsMatcherFactory(matched?: (left: any[], right: (any|It<any>)[]) => boolean): ArgumentsMatcher {
        return (<any>{
            matched: matched
        } as ArgumentsMatcher);
    }

    it("Returns true when they are equal", () => {
        const arguments1 = [];
        const arguments2 = [];

        const name = "name";
        const left = new NamedMethodInteraction(name, arguments1);
        const right = new ExpectedNamedMethodExpression(name, arguments2);

        const matched = (lvalue, rvalue): boolean => {
            expect(lvalue).toBe(arguments1);
            expect(rvalue).toBe(arguments2);
            return true;
        };

        const matcher = new NamedMethodExpressionMatcher(argumentsMatcherFactory(matched));
        const actual = matcher.matched(left, right);

        expect(actual).toBe(true);
    });

    it("Returns true when right is predicate that returns true", () => {
        const left = new NamedMethodInteraction("name", []);

        const right = It.Is((value) => {
            expect(value).toBe(left);
            return true;
        });

        const matcher = new NamedMethodExpressionMatcher(argumentsMatcherFactory(undefined));
        const actual = matcher.matched(left, right);

        expect(actual).toBe(true);
    });

    it("Returns false when left does not equal to right by args", () => {
        const arguments1 = [];
        const arguments2 = [];

        const name = "name";
        const left = new NamedMethodInteraction(name, arguments1);
        const right = new ExpectedNamedMethodExpression(name, arguments2);

        const matched = (lvalue, rvalue): boolean => {
            expect(lvalue).toBe(arguments1);
            expect(rvalue).toBe(arguments2);
            return false;
        };

        const matcher = new NamedMethodExpressionMatcher(argumentsMatcherFactory(matched));
        const actual = matcher.matched(left, right);

        expect(actual).toBe(false);
    });

    it("Returns false when left does not equal to right by name", () => {
        const args = [];

        const left = new NamedMethodInteraction("left name", args);
        const right = new ExpectedNamedMethodExpression("right name", args);

        const matched = (lvalue, rvalue): boolean => {
            expect(lvalue).toBe(args);
            expect(rvalue).toBe(args);
            return true;
        };

        const matcher = new NamedMethodExpressionMatcher(argumentsMatcherFactory(matched));
        const actual = matcher.matched(left, right);

        expect(actual).toBe(false);
    });

    it("Returns false when right is predicate that returns false", () => {
        const left = new NamedMethodInteraction("name", []);
        const right = It.Is((value) => {
            expect(value).toBe(left);
            return false;
        });

        const matcher = new NamedMethodExpressionMatcher(argumentsMatcherFactory(undefined));
        const actual = matcher.matched(left, right);

        expect(actual).toBe(false);
    });

    it("Does not call args matcher when names are not equal", () => {
        const args = [];

        const left = new NamedMethodInteraction("left name", args);
        const right = new ExpectedNamedMethodExpression("right name", args);

        const matched = (lvalue, rvalue): boolean => {
            fail("Should not be called");
            return false;
        };

        const matcher = new NamedMethodExpressionMatcher(argumentsMatcherFactory(matched));
        const actual = matcher.matched(left, right);

        expect(actual).toBe(false);
    });

});

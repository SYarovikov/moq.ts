import { It } from "../reflector/expression-predicates";

/**
 * @hidden
 */
export class ConstantMatcher {
    public matched(left: any, right: any | It<any>): boolean {
        if (right instanceof It) {
            return (right as It<any>).test(left);
        }
        return left === right;
    }
}


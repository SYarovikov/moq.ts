/*eslint-disable max-classes-per-file*/
import { It } from "./expression-predicates";
import {
    GetPropertyInteraction,
    InOperatorInteraction,
    MethodInteraction,
    NamedMethodInteraction,
    NewOperatorInteraction,
    SetPropertyInteraction
} from "../interactions";

/**
 * See {@link NamedMethodInteraction}
 */
export class NamedMethodExpression extends NamedMethodInteraction {

}

/**
 * See {@link MethodInteraction}
 */
export class MethodExpression extends MethodInteraction {

}

/**
 * See {@link GetPropertyInteraction}
 */
export class GetPropertyExpression extends GetPropertyInteraction {

}

/**
 * See {@link SetPropertyInteraction}
 */
export class SetPropertyExpression extends SetPropertyInteraction {

}

/**
 * See {@link InOperatorInteraction}
 */
export class InOperatorExpression extends InOperatorInteraction {

}

/**
 * See {@link NewOperatorInteraction}
 */
export class NewOperatorExpression extends NewOperatorInteraction {

}

/**
 * This types are special sub types of expressions that are used in an expectation context.
 */
export type Expressions<T> =
    MethodExpression
    | GetPropertyExpression
    | SetPropertyExpression
    | InOperatorExpression
    | NamedMethodExpression
    | NewOperatorExpression
    | It<T>;

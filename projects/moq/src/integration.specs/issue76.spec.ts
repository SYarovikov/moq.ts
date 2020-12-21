/*eslint-disable max-classes-per-file*/
import { Mock } from "../lib/mock";
import { It } from "../lib/reflector/expression-predicates";
import { Interaction } from "../lib/interactions";

class SimpleMimic {

}

class Dummy extends SimpleMimic {
    public func(param: number): number {
        return param * 2;
    }
}

describe("#76 Prototypeof & mimics do not respect each other", () => {
    it("the bug", () => {
        const mock = new Mock<Dummy>()
            .prototypeof(Dummy.prototype)
            .setup(() => It.Is(expression => {
                if (expression instanceof Interaction) {
                    return Reflect.has(SimpleMimic.prototype, expression.name);
                }
                return false;
            }))
            .mimics(new SimpleMimic() as any);

        const actual = mock.object().func(2);
        expect(actual).toEqual(undefined);
    });
});

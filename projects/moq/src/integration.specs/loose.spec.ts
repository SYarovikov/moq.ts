import { Mock } from "../lib/mock";
import { It } from "../lib/reflector/expression-predicates";
import { GetPropertyInteraction, NamedMethodInteraction, SetPropertyInteraction } from "../lib/interactions";

describe("Loose configuration", () => {
    it("Returns a spy function", () => {
        const mock = new Mock<any>();
        mock
            .setup(() => It.IsAny())
            .callback(interaction => {
                const source: { __map: any } = (mock as any);
                source.__map = source.__map || {};
                if (interaction instanceof GetPropertyInteraction) {
                    if (source.__map[interaction.name] === undefined) {
                        source.__map[interaction.name] = (...args) => {
                            mock.tracker.add(new NamedMethodInteraction(interaction.name, args));
                        };
                    }
                    return source.__map[interaction.name];
                }
                if (interaction instanceof SetPropertyInteraction) {
                    return true;
                }
            });

        const actual = mock.object().func(1);
        expect(actual).toBe(undefined);
        mock.verify(instance => instance.func(1));
    });

    it("Returns the same spy function", () => {
        const mock = new Mock<any>();
        mock
            .setup(() => It.IsAny())
            .callback(interaction => {
                const source: { __map: any } = (mock as any);
                source.__map = source.__map || {};
                if (interaction instanceof GetPropertyInteraction) {
                    if (source.__map[interaction.name] === undefined) {
                        source.__map[interaction.name] = (...args) => {
                            mock.tracker.add(new NamedMethodInteraction(interaction.name, args));
                        };
                    }
                    return source.__map[interaction.name];
                }
                if (interaction instanceof SetPropertyInteraction) {
                    return true;
                }
            });

        const actual1 = mock.object().func;
        const actual2 = mock.object().func;
        expect(actual1).toBe(actual2);
    });

    it("Returns different spy functions", () => {
        const mock = new Mock<any>();
        mock
            .setup(() => It.IsAny())
            .callback(interaction => {
                const source: { __map: any } = (mock as any);
                source.__map = source.__map || {};
                if (interaction instanceof GetPropertyInteraction) {
                    if (source.__map[interaction.name] === undefined) {
                        source.__map[interaction.name] = (...args) => {
                            mock.tracker.add(new NamedMethodInteraction(interaction.name, args));
                        };
                    }
                    return source.__map[interaction.name];
                }
                if (interaction instanceof SetPropertyInteraction) {
                    return true;
                }
            });

        const actual1 = mock.object().func;
        const actual2 = mock.object().func2;
        expect(actual1).not.toBe(actual2);
    });

    it("Writes property", () => {
        const mock = new Mock<any>();
        mock
            .setup(() => It.IsAny())
            .callback(interaction => {
                const source: { __map: any } = (mock as any);
                source.__map = source.__map || {};
                if (interaction instanceof GetPropertyInteraction) {
                    if (source.__map[interaction.name] === undefined) {
                        source.__map[interaction.name] = (...args) => {
                            mock.tracker.add(new NamedMethodInteraction(interaction.name, args));
                        };
                    }
                    return source.__map[interaction.name];
                }
                if (interaction instanceof SetPropertyInteraction) {
                    return true;
                }
            });

        mock.object().func = 1;
        const actual = mock.object().func;

        expect(actual).toBe(1);
        mock.verify(instance => instance.func = 1);
    });
});

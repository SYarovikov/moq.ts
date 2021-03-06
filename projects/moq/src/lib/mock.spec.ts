import { IInjectorConfig, IPresetBuilder, ISequenceVerifier } from "./moq";
import { Times } from "./times";
import { nameof } from "../tests.components/nameof";
import { ExpressionReflector } from "./reflector/expression-reflector";
import { Tracker } from "./tracker/tracker";
import { ProxyFactory } from "./interceptors/proxy.factory";
import { Verifier } from "./verification/verifier";
import { Mock } from "./mock";
import { Expressions } from "./reflector/expressions";
import { PrototypeStorage } from "./interceptors/prototype.storage";
import { createInjector, resolve } from "../tests.components/resolve.builder";
import { MethodInteraction } from "./interactions";
import { MOCK_OPTIONS } from "./mock-options/mock-options.injection-token";
import { PRESET_BUILDER_FACTORY } from "./presets/preset-builder-factory.injection-token";
import { MOCK } from "./injector/moq.injection-token";
import { DefaultInjectorConfig } from "./injector/default-injector.config";
import * as injectorFactory from "./injector/injector.factory";

describe("Mock", () => {
    beforeEach(() => {
        const expressionReflector = jasmine.createSpyObj<ExpressionReflector>(["reflect"]);
        const tracker = jasmine.createSpyObj<Tracker>(["get"]);
        const proxyFactory = jasmine.createSpyObj<ProxyFactory<unknown>>(["object"]);
        const setupFactory = jasmine.createSpy();
        const verifier = jasmine.createSpyObj<Verifier<unknown>>(["test"]);
        const prototypeStorage = jasmine.createSpyObj<PrototypeStorage>("", ["set"]);

        const injector = createInjector([
            {provide: ExpressionReflector, useValue: expressionReflector, deps: []},
            {provide: Tracker, useValue: tracker, deps: []},
            {provide: ProxyFactory, useValue: proxyFactory, deps: []},
            {provide: Verifier, useValue: verifier, deps: []},
            {provide: PrototypeStorage, useValue: prototypeStorage, deps: []},
            {provide: PRESET_BUILDER_FACTORY, useValue: setupFactory, deps: []},
            {provide: MOCK_OPTIONS, useValue: {}, deps: []},
        ]);

        spyOn(injectorFactory, "injectorFactory").and.returnValue(injector);
    });

    it("Exposes mock name", () => {
        const name = "mock name";
        const options = {name};

        Object.defineProperty(resolve(MOCK_OPTIONS), "name", {value: name});

        const mock = new Mock(options);
        const actual = mock.name;

        expect(actual).toBe(name);
    });

    it("Exposes mock options", () => {
        const mock = new Mock();
        expect(mock.options).toBe(resolve(MOCK_OPTIONS));
    });

    it("Returns object", () => {
        const object = {};
        resolve(ProxyFactory).object.and.returnValue(object);

        const mock = new Mock();
        const actual = mock.object();

        expect(actual).toBe(object);
    });

    it("Verifies an expression", () => {
        const expressions = [];
        resolve(Tracker).get.and.returnValue(expressions);

        const mock = new Mock();
        const expression = instance => instance["property"];
        const actual = mock.verify(expression);

        expect(actual).toBe(mock);
        expect(resolve(Verifier).test).toHaveBeenCalledWith(expression, Times.Once(), expressions, undefined);
    });

    it("Verifies an expression has been invoked provided times", () => {
        const mockName = "name";
        const id = 1;
        const interaction = new MethodInteraction([]);
        const expressions = [
            {id, expression: interaction}
        ];
        resolve(Tracker).get.and.returnValue(expressions);
        Object.defineProperty(resolve(MOCK_OPTIONS), "name", {value: mockName});

        const mock = new Mock();
        const expression = instance => instance["property"];
        const actual = mock.verify(expression, Times.AtLeastOnce());

        expect(actual).toBe(mock);
        expect(resolve(Verifier).test).toHaveBeenCalledWith(expression, Times.AtLeastOnce(), [interaction], mockName);
    });

    it("Setups mock", () => {
        const setup = {} as IPresetBuilder<any>;
        const expression = instance => instance["property"];
        const expectedExpression = {} as Expressions<unknown>;
        resolve(ExpressionReflector).reflect.withArgs(expression).and.returnValue(expectedExpression);
        resolve(PRESET_BUILDER_FACTORY).withArgs(expectedExpression).and.returnValue(setup);

        const mock = new Mock();

        const actual = mock.setup(expression);

        expect(actual).toBe(setup);
    });

    it("Sets prototype of mock", () => {
        const prototype = {};

        const mock = new Mock();
        mock.prototypeof(prototype);

        expect(resolve(PrototypeStorage).set).toHaveBeenCalledWith(prototype);
    });

    it("Returns the current instance of mock from prototypeof", () => {
        const mock = new Mock();
        const actual = mock.prototypeof();

        expect(actual).toBe(mock);
    });

    it("Adds verified expression into sequence verifier", () => {
        const sequenceVerifier = jasmine.createSpyObj("sequence verifier", [
            nameof<ISequenceVerifier>("add")
        ]) as ISequenceVerifier;
        const expression = instance => instance["property"];

        const mock = new Mock();
        const actual = mock.insequence(sequenceVerifier, expression);

        expect(actual).toBe(mock);
        expect(sequenceVerifier.add).toHaveBeenCalledWith(mock, expression);
    });

    it("Returns default static Mock options", () => {
        const {target, injectorConfig, name} = Mock.options;

        expect(injectorConfig).toEqual(new DefaultInjectorConfig());
        expect(typeof target === "function").toBe(true);
        expect(name).toBe(undefined);
    });

    it("Invokes injectorFactory with static provider of self", () => {
        const mock = new Mock();
        expect(injectorFactory.injectorFactory).toHaveBeenCalledWith(Mock.options, {
            provide: MOCK,
            useValue: mock,
            deps: []
        });
    });

    it("Invokes injectorFactory with overridden static options", () => {
        const name = "name";
        const target = () => undefined;
        const injectorConfig = jasmine.createSpyObj<IInjectorConfig>(["get"]);
        Mock.options = {name, target, injectorConfig};

        const mock = new Mock();

        // Since this one is a static singleton we have to restore it
        Mock.options = undefined;

        expect(injectorFactory.injectorFactory).toHaveBeenCalledWith({
            name,
            target,
            injectorConfig
        }, {provide: MOCK, useValue: mock, deps: []});
    });

    it("Invokes injectorFactory with overridden instance options", () => {
        const name = "name";
        const target = () => undefined;
        const injectorConfig = jasmine.createSpyObj<IInjectorConfig>(["get"]);

        const mock = new Mock({name, target, injectorConfig});

        expect(injectorFactory.injectorFactory).toHaveBeenCalledWith({
            name,
            target,
            injectorConfig
        }, {provide: MOCK, useValue: mock, deps: []});
    });
});

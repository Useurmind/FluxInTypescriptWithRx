import { SimpleContainer } from "../../src/DependencyInjection/SimpleContainer";
import { SimpleContainerBuilder } from "../../src/DependencyInjection/SimpleContainerBuilder";

describe("SimpleContainer", () =>
{
    const registrationKey1 = "lksjfkfdjg";
    const registrationKey2 = "sdölgkjfdhlgkfgjkh";

    it("optional resolve without registration returns null", () =>
    {
        const builder = new SimpleContainerBuilder();

        const container = builder.build();

        const result = container.resolveOptional(registrationKey1);

        expect(result).toBe(null);
    });

    it("register and resolve works", () =>
    {
        const builder = new SimpleContainerBuilder();
        const registeredString = "lkjghflhjkfgljhfgh";
        builder.register(c => registeredString)
                 .as(registrationKey1);

        const container = builder.build();

        const result = container.resolve(registrationKey1);
        const result2 = container.resolveOptional(registrationKey1);

        expect(result).toBe(registeredString);
        expect(result2).toBe(result);
    });

    it("register and resolve multiple times returns the same object", () =>
    {
        const builder = new SimpleContainerBuilder();
        builder.register(c => ({ a: 1 }))
                 .as(registrationKey1);

        const container = builder.build();

        const result1 = container.resolve(registrationKey1);
        const result2 = container.resolve(registrationKey1);

        expect(result1).toBe(result2);
    });

    it("register and resolve with instance names returns the same object per name", () =>
    {
        const builder = new SimpleContainerBuilder();
        builder.register(c => ({ a: 1 }))
                 .as(registrationKey1);

        const container = builder.build();

        const result1 = container.resolve(registrationKey1);
        const result2 = container.resolve(registrationKey1, "instance1");
        const result3 = container.resolve(registrationKey1, "instance2");
        const result4 = container.resolve(registrationKey1, "instance2");

        expect(result1).not.toBe(result2);
        expect(result1).not.toBe(result3);
        expect(result2).not.toBe(result3);
        expect(result1).not.toBe(result4);
        expect(result3).toBe(result4);
    });

    it("register and resolve with multiple type names returns the same object per instance name", () =>
    {
        const builder = new SimpleContainerBuilder();
        builder.register(c => ({ a: 1 }))
                 .as(registrationKey1)
                 .as(registrationKey2);

        const container = builder.build();

        const result1 = container.resolve(registrationKey1);
        const result2 = container.resolve(registrationKey1, "instance1");
        const result3 = container.resolve(registrationKey1, "instance2");
        const result4 = container.resolve(registrationKey1, "instance2");

        const result12 = container.resolve(registrationKey2);
        const result22 = container.resolve(registrationKey2, "instance1");
        const result32 = container.resolve(registrationKey2, "instance2");
        const result42 = container.resolve(registrationKey2, "instance2");

        expect(result1).not.toBe(result2);
        expect(result1).not.toBe(result3);
        expect(result2).not.toBe(result3);
        expect(result1).not.toBe(result4);
        expect(result3).toBe(result4);

        expect(result12).toBe(result1);
        expect(result22).toBe(result2);
        expect(result32).toBe(result3);
        expect(result42).toBe(result4);
    });

    it("register collection and resolve with instance names returns the same collection per name", () =>
    {
        const builder = new SimpleContainerBuilder();
        builder.register(c => ({ a: 1 })).in(registrationKey1);
        builder.register(c => ({ a: 2 })).in(registrationKey1);

        const container = builder.build();

        const result1 = container.resolve<any[]>(registrationKey1);
        const result2 = container.resolve<any[]>(registrationKey1, "instance1");
        const result3 = container.resolve<any[]>(registrationKey1, "instance2");
        const result4 = container.resolve<any[]>(registrationKey1, "instance2");

        expect(result1.length).toBe(2);
        expect(result2.length).toBe(2);
        expect(result3.length).toBe(2);
        expect(result4.length).toBe(2);

        expect(result1[0]).not.toBe(result2[0]);
        expect(result1[0]).not.toBe(result3[0]);
        expect(result2[0]).not.toBe(result3[0]);
        expect(result1[0]).not.toBe(result4[0]);
        expect(result3[0]).toBe(result4[0]);
    });

    it("two registrations resolve their values", () =>
    {
        const builder = new SimpleContainerBuilder();
        const registeredString1 = "lkjghflhjkfgljhfgh";
        const registeredString2 = "ödlghkjghfölkj";

        builder.register(c => registeredString1).as(registrationKey1);
        builder.register(c => registeredString2).as(registrationKey2);

        const container = builder.build();

        const result1 = container.resolve(registrationKey1);
        const result2 = container.resolve(registrationKey2);

        expect(result1).toBe(registeredString1);
        expect(result2).toBe(registeredString2);
    });

    it("register collection and resolve works", () =>
    {
        const builder = new SimpleContainerBuilder();
        const registeredString1 = "lkjghflhjkfgljhfgh";
        const registeredString2 = "ölkjfgöhlkjfg";
        builder.register(c => registeredString1).in(registrationKey1);
        builder.register(c => registeredString2).in(registrationKey1);

        const container = builder.build();

        const result = container.resolve<string[]>(registrationKey1);

        expect(result.length).toBe(2);
        expect(result[0]).toBe(registeredString1);
        expect(result[1]).toBe(registeredString2);
    });

    it("register and resolve with instance names returns different instances", () =>
    {
        const builder = new SimpleContainerBuilder();
        const registeredString1 = "lkjghflhjkfgljhfgh";
        const registeredString2 = "ölkjfgöhlkjfg";
        builder.register(c => registeredString1).in(registrationKey1);
        builder.register(c => registeredString2).in(registrationKey1);

        const container = builder.build();

        const result = container.resolve<string[]>(registrationKey1);

        expect(result.length).toBe(2);
        expect(result[0]).toBe(registeredString1);
        expect(result[1]).toBe(registeredString2);
    });

    it("register and resolve with dependencies works", () =>
    {
        const builder = new SimpleContainerBuilder();
        const registeredString2 = "ölkjfgöhlkjfg";
        builder.register(c => ({ dep: c.resolve<string>(registrationKey2) }))
                 .as(registrationKey1);
        builder.register(c => registeredString2)
                 .as(registrationKey2);

        const container = builder.build();

        const result = container.resolve<any>(registrationKey1);

        expect(result.dep).toBe(registeredString2);
    });

    it("resolving not registered collection returns empty array", () =>
    {
        const builder = new SimpleContainerBuilder();
        const container = builder.build();

        const result = container.resolveMultiple<any[]>(registrationKey1);

        expect(result).not.toBeNull();
        expect(result.length).toBe(0);
    });

    it("can resolve instance from parent container", () =>
    {
        const registeredStringInParent = "ölkjfgöhlkjfg";
        const builderParent = new SimpleContainerBuilder();
        builderParent.register(c => registeredStringInParent)
                     .as(registrationKey1);
        const parent = builderParent.build();

        const builder = new SimpleContainerBuilder();
        builder.addParentContainer(parent);
        const container = builder.build();

        const result = container.resolve<string>(registrationKey1);

        expect(result).toBe(registeredStringInParent);
    });
});

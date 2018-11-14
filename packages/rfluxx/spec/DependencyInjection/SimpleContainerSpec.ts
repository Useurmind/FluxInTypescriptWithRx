import { SimpleContainer } from "../../src/DependencyInjection/SimpleContainer";

describe("SimpleContainer", () =>
{
    const registrationKey1 = "lksjfkfdjg";
    const registrationKey2 = "sdölgkjfdhlgkfgjkh";

    it("register and resolve works", () =>
    {
        const container = new SimpleContainer();
        const registeredString = "lkjghflhjkfgljhfgh";
        container.register(registrationKey1, c => registeredString);

        const result = container.resolve(registrationKey1);

        expect(result).toBe(registeredString);
    });

    it("register and resolve multiple times returns the same object", () =>
    {
        const container = new SimpleContainer();
        container.register(registrationKey1, c => ({ a: 1 }));

        const result1 = container.resolve(registrationKey1);
        const result2 = container.resolve(registrationKey1);

        expect(result1).toBe(result2);
    });

    it("register and resolve with instance names returns the same object per name", () =>
    {
        const container = new SimpleContainer();
        container.register(registrationKey1, c => ({ a: 1 }));

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

    it("register collection and resolve with instance names returns the same collection per name", () =>
    {
        const container = new SimpleContainer();
        container.registerInCollection(registrationKey1, c => ({ a: 1 }));
        container.registerInCollection(registrationKey1, c => ({ a: 2 }));

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
        const container = new SimpleContainer();
        const registeredString1 = "lkjghflhjkfgljhfgh";
        const registeredString2 = "ödlghkjghfölkj";

        container.register(registrationKey1, c => registeredString1);
        container.register(registrationKey2, c => registeredString2);

        const result1 = container.resolve(registrationKey1);
        const result2 = container.resolve(registrationKey2);

        expect(result1).toBe(registeredString1);
        expect(result2).toBe(registeredString2);
    });

    it("register collection and resolve works", () =>
    {
        const container = new SimpleContainer();
        const registeredString1 = "lkjghflhjkfgljhfgh";
        const registeredString2 = "ölkjfgöhlkjfg";
        container.registerInCollection(registrationKey1, c => registeredString1);
        container.registerInCollection(registrationKey1, c => registeredString2);

        const result = container.resolve<string[]>(registrationKey1);

        expect(result.length).toBe(2);
        expect(result[0]).toBe(registeredString1);
        expect(result[1]).toBe(registeredString2);
    });

    it("register and resolve with instance names returns different instances", () =>
    {
        const container = new SimpleContainer();
        const registeredString1 = "lkjghflhjkfgljhfgh";
        const registeredString2 = "ölkjfgöhlkjfg";
        container.registerInCollection(registrationKey1, c => registeredString1);
        container.registerInCollection(registrationKey1, c => registeredString2);

        const result = container.resolve<string[]>(registrationKey1);

        expect(result.length).toBe(2);
        expect(result[0]).toBe(registeredString1);
        expect(result[1]).toBe(registeredString2);
    });

    it("register and resolve with dependencies works", () =>
    {
        const container = new SimpleContainer();
        const registeredString2 = "ölkjfgöhlkjfg";
        container.register(registrationKey1, c => ({ dep: c.resolve<string>(registrationKey2) }));
        container.register(registrationKey2, c => registeredString2);

        const result = container.resolve<any>(registrationKey1);

        expect(result.dep).toBe(registeredString2);
    });
});

import { getSingletonCreator } from "../../src/DependencyInjection/getSingletonCreator";

class Something {}

describe("getSingletonCreator", () =>
{
    const instanceName1 = "lksjfkfdjg";
    const instanceName2 = "sdölgkjfdhlgkfgjkh";

    it("creating a no name instance works", () =>
    {
        const createSingleton = getSingletonCreator(_ => new Something());

        const instance = createSingleton(null, null);

        expect(instance).not.toBe(null);
    });

    it("creating two no name instances return the same instance", () =>
    {
        const createSingleton = getSingletonCreator(_ => new Something());

        const instance1 = createSingleton(null, null);
        const instance2 = createSingleton(null, null);

        expect(instance1).not.toBe(null);
        expect(instance2).toBe(instance1);
    });

    it("no name instance different from named instance", () =>
    {
        const createSingleton = getSingletonCreator(_ => new Something());

        const instance1 = createSingleton(null, null);
        const instance2 = createSingleton(null, instanceName1);

        expect(instance1).not.toBe(null);
        expect(instance2).not.toBe(null);
        expect(instance2).not.toBe(instance1);
    });

    it("two instances with same name are the same", () =>
    {
        const createSingleton = getSingletonCreator(_ => new Something());

        const instance1 = createSingleton(null, instanceName1);
        const instance2 = createSingleton(null, instanceName1);

        expect(instance1).not.toBe(null);
        expect(instance2).not.toBe(null);
        expect(instance2).toBe(instance1);
    });

    it("two instances with different names are different", () =>
    {
        const createSingleton = getSingletonCreator(_ => new Something());

        const instance1 = createSingleton(null, instanceName1);
        const instance2 = createSingleton(null, instanceName2);

        expect(instance1).not.toBe(null);
        expect(instance2).not.toBe(null);
        expect(instance2).not.toBe(instance1);
    });
});

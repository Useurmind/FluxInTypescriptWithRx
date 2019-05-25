import { createIntIdentityFunction } from "../src/storage/createIntIdentityFunction";

describe("createIntIdentityFunctionSpec", () =>
{
    it("function returns a number", () =>
    {
        const createId = createIntIdentityFunction();

        const id = createId();

        expect(typeof id).toBe("number");
    });

    it("calling the function two times creates a different number", () =>
    {
        const createId = createIntIdentityFunction();

        const id1 = createId();
        const id2 = createId();

        expect(typeof id1).toBe("number");
        expect(typeof id2).toBe("number");
        expect(id1).not.toBe(id2);
    });

    it("two identity functions create the same series of numbers", () =>
    {
        const createId1 = createIntIdentityFunction();
        const createId2 = createIntIdentityFunction();

        const id1_1 = createId1();
        const id2_1 = createId2();
        const id1_2 = createId1();
        const id2_2 = createId2();

        expect(typeof id1_1).toBe("number");
        expect(typeof id1_2).toBe("number");
        expect(typeof id2_1).toBe("number");
        expect(typeof id2_2).toBe("number");
        expect(id1_1).toBe(id2_1);
        expect(id1_2).toBe(id2_2);
    });
});

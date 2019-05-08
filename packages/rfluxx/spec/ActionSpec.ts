import { Action } from "../src/Action";

describe("Actions", () =>
{
    it("subcribe and trigger should work", () =>
    {
        const action = new Action<number>();
        let triggeredNumber: number = null;

        action.subscribe(n => triggeredNumber = n);

        action.trigger(1);

        expect(triggeredNumber).toBe(1);
    });

    it("late subscriber should not be triggered", () =>
    {
        const action = new Action<number>();
        let triggeredNumber: number = null;

        action.trigger(1);

        action.subscribe(n => triggeredNumber = n);

        expect(triggeredNumber).toBe(null);
    });
});

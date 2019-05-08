import { IStore, Store, StoreSubscription } from "../src";
import { Action } from "../src/Action";

interface ITestStoreState
{
    someString: string;
}

class TestStore extends Store<ITestStoreState>
{
    constructor(initialString: string)
    {
        super({
            initialState: {
                someString: initialString
            }
        });
    }

    public changeSomeString(value: string)
    {
        this.setState({ ...this.state, someString: value });
    }
}

describe("StoreSubscriptions", () =>
{
    it("subscription delivers initial state", () =>
    {
        const initialString = "asklffdkg";
        const store = new TestStore(initialString);
        const storeSubscription = new StoreSubscription<IStore<ITestStoreState>, ITestStoreState>();
        const stringValues: string[] = [];

        storeSubscription.subscribeStore(store, s => stringValues.push(s.someString));

        expect(stringValues.length).toBe(1);
        expect(stringValues).toEqual([initialString]);
    });

    it("after subscribing store can be retrieved", () =>
    {
        const initialString = "asklffdkg";
        const store = new TestStore(initialString);
        const storeSubscription = new StoreSubscription<IStore<ITestStoreState>, ITestStoreState>();
        const stringValues: string[] = [];

        storeSubscription.subscribeStore(store, s => stringValues.push(s.someString));

        expect(storeSubscription.store).toBe(store);
    });

    it("after unsubscribing store is null", () =>
    {
        const initialString = "asklffdkg";
        const store = new TestStore(initialString);
        const storeSubscription = new StoreSubscription<IStore<ITestStoreState>, ITestStoreState>();
        const stringValues: string[] = [];

        storeSubscription.subscribeStore(store, s => stringValues.push(s.someString));
        storeSubscription.unsubscribe();

        expect(storeSubscription.store).toBe(null);
    });

    it("after unsubscribing state is not delivered anymore", () =>
    {
        const initialString = "asklffdkg";
        const updatedString = "fdh.,fgh";
        const store = new TestStore(initialString);
        const storeSubscription = new StoreSubscription<IStore<ITestStoreState>, ITestStoreState>();
        const stringValues: string[] = [];

        storeSubscription.subscribeStore(store, s => stringValues.push(s.someString));
        storeSubscription.unsubscribe();

        store.changeSomeString(updatedString);

        expect(stringValues.length).toBe(1);
        expect(stringValues).toEqual([initialString]);
    });

    it("state is updated and published", () =>
    {
        const initialString = "asklffdkg";
        const updatedString = "hgkljhk";
        const store = new TestStore(initialString);
        const storeSubscription = new StoreSubscription<IStore<ITestStoreState>, ITestStoreState>();
        const stringValues: string[] = [];

        storeSubscription.subscribeStore(store, s => stringValues.push(s.someString));

        store.changeSomeString(updatedString);

        expect(stringValues.length).toBe(2);
        expect(stringValues).toEqual([initialString, updatedString]);
    });

    it("multiple sequential unsubscribes work", () =>
    {
        const initialString = "asklffdkg";
        const updatedString = "hgkljhk";
        const store = new TestStore(initialString);
        const storeSubscription = new StoreSubscription<IStore<ITestStoreState>, ITestStoreState>();
        const stringValues: string[] = [];

        storeSubscription.subscribeStore(store, s => stringValues.push(s.someString));

        storeSubscription.unsubscribe();
        storeSubscription.unsubscribe();
        storeSubscription.unsubscribe();
    });
});

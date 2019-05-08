import { IObservableFetcher, Store } from "../src";
import { Action } from "../src/Action";
import { FakeFetcher } from "../src/Fetch/FakeFetcher";

interface ITestStoreState
{
    someString: string;
}

class TestStore extends Store<ITestStoreState>
{
    constructor(initialString: string, fetcher?: IObservableFetcher)
    {
        super({
            initialState: {
                someString: initialString
            },
            fetcher
        });
    }

    public changeSomeString(value: string)
    {
        this.setState({ ...this.state, someString: value });
    }

    public setStateNull()
    {
        this.setState(null);
    }

    public setStateToItself()
    {
        this.setState(this.state);
    }

    public fetchSomeStuff(afterFetch: () => void)
    {
        this.fetch("http://someurl.com")
            .subscribe(response =>
            {
                // resolving the promise is asynchonous
                // it will not be peformed immediately in place
                // like the subscribe call
                response.text().then(result =>
                {
                   this.changeSomeString(result);
                   afterFetch();
                });
            });
    }
}

describe("Stores", () =>
{
    it("initial state is applied", () =>
    {
        const initialString = "asklffdkg";
        const store = new TestStore(initialString);
        let actualInitialString: string = null;

        store.subscribe(s => actualInitialString = s.someString);

        expect(actualInitialString).toBe(initialString);
    });

    it("state is updated and published", () =>
    {
        const initialString = "asklffdkg";
        const updatedString = "hjkl";
        const store = new TestStore(initialString);
        const stringValues: string[] = [];

        store.subscribe(s => stringValues.push(s.someString));

        store.changeSomeString(updatedString);

        expect(stringValues.length).toBe(2);
        expect(stringValues).toEqual([initialString, updatedString]);
    });

    it("late subscriber get update state", () =>
    {
        const initialString = "asklffdkg";
        const updatedString = "hjlk";
        const store = new TestStore(initialString);
        const stringValues: string[] = [];

        store.changeSomeString(updatedString);

        store.subscribe(s => stringValues.push(s.someString));

        expect(stringValues.length).toBe(1);
        expect(stringValues).toEqual([updatedString]);
    });

    it("set state null does not trigger state change", () =>
    {
        const initialString = "asklffdkg";
        const updatedString = "hjlk";
        const store = new TestStore(initialString);
        const stringValues: string[] = [];

        store.subscribe(s => stringValues.push(s.someString));

        store.setStateNull();

        expect(stringValues.length).toBe(1);
        expect(stringValues).toEqual([initialString]);
    });

    it("set state to same value triggers state change", () =>
    {
        const initialString = "asklffdkg";
        const updatedString = "hjlk";
        const store = new TestStore(initialString);
        const stringValues: string[] = [];

        store.subscribe(s => stringValues.push(s.someString));

        store.setStateToItself();

        expect(stringValues.length).toBe(2);
        expect(stringValues).toEqual([initialString, initialString]);
    });

    it("fetch stuff with fake fetcher updates state correctly", () =>
    {
        const responseValue = "my response value";
        const response = new Response(responseValue);
        const fetcher = new FakeFetcher({
            fixedResponse: new Response(responseValue)
        });
        const initialString = "asklffdkg";
        const store = new TestStore(initialString, fetcher);
        const stringValues: string[] = [];

        store.subscribe(s => stringValues.push(s.someString));

        store.fetchSomeStuff(() =>
        {
            expect(stringValues.length).toBe(2);
            expect(stringValues).toEqual([initialString, responseValue]);
        });

        expect(fetcher.fetches).toBe(1);
        response.text().then(text => expect(text).toBe(responseValue));
    });
});

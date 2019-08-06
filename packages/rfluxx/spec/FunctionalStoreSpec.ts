
import { BehaviorSubject, Observable } from "rxjs";
import { IObservableFetcher, Store, IAction } from "../src";
import { Action } from "../src/Action";
import { FakeFetcher } from "../src/Fetch/FakeFetcher";
import { handleAction, reduceAction, createReducer } from '../src/StoreHooks';

interface ITestStoreState
{
    someString: string;
}

interface ITestStore
{
    changeSomeString: IAction<string>;
}

export type IStoreStateResult<TState> = [TState, (s: TState) => void];

export function useStoreState<TState>(initialState: TState): [BehaviorSubject<TState>, (s: TState) => void]
{
    const subject = new BehaviorSubject<TState>(initialState);

    return [
        subject,
        (state: TState) =>
        {
            if (state)
            {
                subject.next(state);
            }
        }
    ];
}

const functionalTestStore = (initialString: string, fetcher?: IObservableFetcher) =>
{
    const [state, setState] = useStoreState({ someString: initialString });

    const setSomeString = createReducer(state)<string>((s, evt) => ({
        ...s,
        someString: evt
    }));

    return {
        subscribe: x => state.subscribe(x),
        changeSomeString: reduceAction(state)(setSomeString),
        setStateNull: handleAction<void>(() => setState(null)),
        setStateToItself: handleAction<void>(() => setState(state.value)),
        fetchSomeStuff: handleAction<() => void>(afterFetch =>
        {
            fetcher.fetch("http://someurl.com")
                    .subscribe(response =>
                    {
                        // resolving the promise is asynchonous
                        // it will not be peformed immediately in place
                        // like the subscribe call
                        response.text().then(result =>
                        {
                            setState(setSomeString(state.value, result));
                            afterFetch();
                        });
                    });
        })
    };
};

describe("FunctionalStores", () =>
{
    it("initial state is applied", () =>
    {
        const initialString = "asklffdkg";
        const store = functionalTestStore(initialString);
        let actualInitialString: string = null;

        store.subscribe(s => actualInitialString = s.someString);

        expect(actualInitialString).toBe(initialString);
    });

    it("state is updated and published", () =>
    {
        const initialString = "asklffdkg";
        const updatedString = "hjkl";
        const store = functionalTestStore(initialString);
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
        const store = functionalTestStore(initialString);
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
        const store = functionalTestStore(initialString);
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
        const store = functionalTestStore(initialString);
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
        const store = functionalTestStore(initialString, fetcher);
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

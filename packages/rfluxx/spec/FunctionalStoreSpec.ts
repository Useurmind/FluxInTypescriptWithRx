
import { BehaviorSubject, Observable } from "rxjs";
import { IObservableFetcher, Store, IAction, IStore, IActionFactory } from "../src";
import { Action } from "../src/Action";
import { FakeFetcher } from "../src/Fetch/FakeFetcher";
import { handleAction, handleActionVoid } from "../src/FunctionalStores/StoreActions";
import { reduceAction } from "../src/FunctionalStores/Reducer";
import { useStoreState, StoreStateSubject } from "../src/FunctionalStores/StoreState";
import { useStore } from "../src/FunctionalStores/StoreCore";

export interface ISimpleFunctionalStoreState {
    someState: string
}

const simpleFunctionalStore = (someOption: string) => {
    const initialState = { someState: someOption };
    const [state, setState, store] = useStore<ISimpleFunctionalStoreState>(initialState);

    return {
        ...store,
        setSomeState: reduceAction(state, (s, someState: string) => ({ ...s, someState }))
    }
}

const store: IStore<ISimpleFunctionalStoreState> = simpleFunctionalStore("asd")

interface ITestStoreState
{
    someString: string;
}

interface IComplexActionEvent {
    someString: string;
    someNumber: number;
}

interface ITestStore extends IStore<ITestStoreState>
{
    changeSomeString(someString: string);

    setStateNull();

    setStateToItself();

    fetchSomeStuff(afterFetch: () => void);

    handleComplexAction(params: IComplexActionEvent);
}

const functionalTestStore = (initialString: string, fetcher?: IObservableFetcher, actionFactory?: IActionFactory): ITestStore =>
{
    const initialState = { someString: initialString };
    const [state, setState, store] = useStore<ITestStoreState>(initialState);

    const setSomeString = (s: ITestStoreState, someString: string) => ({ ...s, someString })

    return {
        ...store,
        changeSomeString: reduceAction(state, setSomeString),
        setStateNull: handleActionVoid(() => setState(null)),
        setStateToItself: handleActionVoid(() => setState(state.value)),
        fetchSomeStuff: handleAction(afterFetch =>
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
        }),
        handleComplexAction: handleAction({
            handleAction: action => action.subscribe(e => {
                // .. do stuff
            }),
            actionMetadata: {
                name: "complex action"
            },
            actionFactory
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

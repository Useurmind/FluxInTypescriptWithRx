# Functional Stores

Class stores are somehow very heavy weight constructs that require many lines of code. When seeing react hooks for the first time their potential for shorter code became clear very fast. Therefore functional stores are an attempt to achieve the same shortness of code with RfluXX stores.

In general the same principals apply to functional stores that also apply to class stores. They even implement the same interface. You can have options, state, interfaces, everything. Or, you just strip it away.

## A stripped example

This example shows that a functional store can be implemented with much less code that a class store:

```typescript
export interface ISimpleFunctionalStoreState {
    someState: string
}

const simpleFunctionalStore = (someOption: string) => {
    const [state, setState, store] = useStore<ISimpleFunctionalStoreState>({ someState: someOption });

    return {
        ...store,
        setSomeState: reduceAction(state, (s, someState: string) => ({ ...s, someState }))
    }
}
```

Arguably you do not have any comments or documentation here. But still it is less boilerplate than with class stores.

## A full example

This example shows a full blown functional store. It is the same example as on Stores.md only with a functional store

```typescript
import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";

// options contain configuration values that do not change over the lifetime
// of a store instance
// this could be for example:
// - (base) urls to call
// - other store instances that are required for intra page communication
//
// here extend IInjectedStoreOptions to be compatible with rfluxx store factory, this will automatically inject an action factory and observable fetcher
export interface IMyStoreOptions     
    extends IInjectedStoreOptions
{
    // fields that represent configuration of the store
}

// the state of the store is the observable data that the store provides
// to the react components
// components can subscribe and use this information to render ui
// in this way updates to the state will automatically be reflected in the UI
export interface IMyStoreState
{
    // fields for the state managed by this store
    someNumber: number;
}

// this interface should be used by the consumers of this store
// it should contain fields for the actions of the store
export interface IMyStore extends IStore<IMyStoreState>
{
    // actions as fields
    // the generic type parameter is the type of the action event
    // it you need multiple values use an interface/object as parameter
    setNumber: IAction<number>;
}

export myStore = (options: IMyStoreOptions) => {
    const [state, setState, store] = useStore<IMyStoreState>({ someNumber: 0 });

    return {
        ...store, 
        setNumber: reduceAction(state, (s, someNumber: number) => ({ ...s, someNumber }))
    }
}
```

We basically came down from 20 lines of code to 7 lines of code.

## Handle Actions via reducer

```typescript
const simpleFunctionalStore = (someOption: string) => {
    const [state, setState, store] = useStore<ISimpleFunctionalStoreState>({ someState: someOption });

    return {
        ...store,
        setSomeState: reduceAction(state, (s, someState: string) => ({ ...s, someState }))
    }
}
```

## Handle actions via callbacks

```typescript
const simpleFunctionalStore = (someOption: string) => {
    const [state, setState, store] = useStore<ISimpleFunctionalStoreState>({ someState: someOption });

    return {
        ...store,
        setSomeState: handleAction((someState: string) => {
            setState({
                ...state.value,
                someState
            });
        });
    }
}
```

## Handle void actions

```typescript
const simpleFunctionalStore = (someOption: string) => {
    const [state, setState, store] = useStore<ISimpleFunctionalStoreState>({ someState: someOption });

    return {
        ...store,
        resetSomeState: handleAction({
            (someState: string) => {
            setState({
                ...state.value,
                someState
            });
        });
    }
}
```

## Complex action example

```typescript
interface IComplexActionEvent {
    someString: string;
    someNumber: number;
}

const simpleFunctionalStore = (someOption: string, actionFactory?: IActionFactory) => {
    const [state, setState, store] = useStore<ISimpleFunctionalStoreState>({ someState: someOption });

    return {
        ...store,
        complexAction: handleAction({
            handleAction: action => action.subscribe(e => {
                // .. do stuff
            }),
            actionMetadata: {
                name: "complex action"
            },
            actionFactory
        })
    }
}
```

## Final thoughts

Functional stores allow you to scale your code as required, where class stores require you to include all of their components. Decide for yourself what fits your needs.


# Bind via Hooks

This approach is only available for functional components as it builds on the react hooks api.

```typescriptreact
// the counter store is not shown

/**
 * Props for { @FuncCounter }
 * Here we implement an interface that has the necessary props for stating which store to resolve from the container.
 */
export interface IFuncCounterProps extends IUseStoreFromContainerContextProps
{
}

/**
 * Component that shows a counter and is bound via a hook.
 * Declare it as an React.SFC.
 */
export const FuncCounter: React.SFC<IFuncCounterProps> = props =>
{
    // here we call a hook that returns the state and store itself
    const [ storeState, store ] = useStoreStateFromContainerContext<ICounterStore, ICounterStoreState>(props);

    // to call an action on a store use the react hook useCallback
    const increment = useCallback(() => store.increment.trigger(1), [ store ]);

    if (!storeState)
    {
        return null;
    }

    return <div>
        <div>Hello Func Counter {storeState.counter}</div>
        <button onClick={increment}>Increment</button>
    </div>;
}
```

The above code takes care of binding the component to the store state. You can use the component `FuncCounter` like any other component.

```typescriptreact
public render(): any
{
    // you can set 
    // storeRegistrationKey: the key under which the store is registered in the container
    // storeInstanceName: any name you like to make multi instancing possible
    return <div>
        <FuncCounter storeRegistrationKey="ICounterStore" storeInstanceName="FuncCounterStore" />
    </div>;
}
```


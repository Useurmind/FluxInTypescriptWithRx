# Bind via HOC

Binding a component via a higher order component takes care of implementing all the above members. But it takes less effort and makes your components simpler to argue about. This is because when binding components via a HOC the former state of the component becomes its props. And handling props is simpler than handling state.

```typescript
// the counter store is not shown

/**
 * These are the props that are provided by the binding via the HOC.
 */
export interface ICounterProps {
    /**
     * A counter that is shown.
     */
    counter: number;

    /**
     * A handler for when the increment button is pressed.
     */
    increment: () => void;
}

/**
 * The component itself is rather simple and just implements rendering some
 * UI with its props.
 */
export class Counter extends React.Component<ICounterProps>
{
    public render(): any
    {
        return <div>
            <div>Hello Counter {this.props.counter}</div>
            <button onClick={this.props.increment} >Increment</button>
        </div>;
    }
}

// this code binds the component Counter to the CounterStore
// the actual instance of the counter store is not yet given
export const CounterBound = subscribeStoreSelect<ICounterStore, ICounterStoreState>()(
    Counter,
    (storeState, store) => ({
        // bind the counter state property to the counter props
        counter: storeState.counter,
        // bind a call to an action to a handler in the counter props
        increment: () => store.increment.trigger(1)
    }));
```

This code takes care of the binding. You can use the component `CounterBound` like any other component.

```typescriptreact
public render(): any
{
    return <div>
        <button onClick={this.onResetCounterStore}>Reset counter store</button>
        <CounterBound store={this.state.counterStore} />
    </div>;
}
```


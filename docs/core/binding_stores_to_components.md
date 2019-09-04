# Binding stores to components

There are different ways to bind stores to components. The simplest being to just subscribe and unsubscribe the store inside the component. The most convenient being to simply wrap a component in a HOC to bind its state to the stores state.

## Bind via Subscribe/unsubscribe

This means to just subscribe/unsubscribe the store in the `componentDidMount` and `componentWillUnmount` member functions. When subscribing the store you select which fields of the stores state go into which fields of the components state.

```typescript
private subscription: Rx.Subscription = null;

public componentDidMount() {
    // subscribe to store (e.g. from props) instances state 
    this.subscription = this.props.store.subscribe(state => {
        this.setState({
            ...this.state,
            // set any state properties from the stores state
        });
    });
}

public componentWillUnmount() {
    // unsubscribe if component is unmounted
    if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
    }
}
```

## Bind via StoreSubscription

This is in principle the same as above but slightly more convenient using the class `StoreSubscription` from the rfluxx package. In addition it is simpler to handle edge cases when updating props.

```typescript
private subscription = new StoreSubscription<IMyStore, IMyStoreState>();

public componentDidMount() {
    this.subscribe();
}

public componentDidUpdate(prevProps) {
    // StoreSubscription does the following so this works
    // - only resubscribes if store is different
    // - automatically unsubscribes the old store
    this.subscribe();
}

public componentWillUnmount() {
    this.subscription.unsubscribe();
}

private subscribe() {
    // subscribe to store (e.g. from props) instances state 
    this.subscription.subscribeStore(this.props.store, state => {
        this.setState({
            ...this.state,
            // set any state properties from the stores state
        });
    });
}
```

## Bind via HOC

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


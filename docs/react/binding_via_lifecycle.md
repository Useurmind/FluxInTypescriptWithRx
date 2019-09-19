# Bind via Lifecycle

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



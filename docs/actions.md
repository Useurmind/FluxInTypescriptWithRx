# Actions

Actions are implemented as simple RX subjects. Triggering them requires as a parameter the type of action event they transport. The action event given when triggering an action will be forwarded to all subscribers of the action. 

# Owned action

In the simplest case an action is created and therefore owned by a store. This usually means that nobody else is expected to require a subscription to the action (except for perhaps middleware).

Such actions are published by store as a property. They provide the limited `IAction` interface that can only be triggered. This is done by giving them an action event of the property type.

__MyStore.ts__
```typescript
export class MyStore // ...
{
    // this action is only provided with the limited IAction interface
    public readonly setNumber: IAction<number>;

    constructor(private options: IMyStoreOptions)
    {
        // ...

        this.setNumber = this.createActionAndSubscribe<number>(someNumber => this.onSetNumber(someNumber));

        // ...
    }

    // ...
}
```

__MyComponent.tsx__
```typescript
export class MyComponent // ...
{
    // ...

    private onButtonPress()
    {
        // call the owned action retrieved from the store
        const store = this.props.container.resolve<ISelectPageStore>("ISelectPageStore");
        store.setNumber.trigger(3);
    }

    // ...
}
```

# Injected actions

In some cases actions need to be available in multiple stores. This can be important to invert a dependency chain or to implement multicase scenarios with actions.

Its recommended to create these actions outside of any store and inject them through the dependency injection container. Anyone interested in triggering/subscribing the action can resolve it from the container or get it injected into its constructor options.

__MyStore.ts__
```typescript
export interface IMyStoreOptions
{
    // ...

    // inject action via options into the store
    // here the observable action interface is used
    setNumber: IObservableAction<number>;

    // ...
}

export class MyStore // ...
{
    constructor(private options: IMyStoreOptions)
    {
        // ...

        options.setNumber.subscribe(someNumber => this.onSetNumber(someNumber));
        
        // ...
    }

    // ...
}
```

__MyComponent.tsx__
```typescript
export class MyComponent // ...
{
    // ...

    private onButtonPress()
    {
        // call the injected action retrieved directly from the container
        const action = this.props.container.resolve<IAction<number>>("KEY_FOR_THE_ACTION");
        action.trigger(3);
    }

    // ...
}
```
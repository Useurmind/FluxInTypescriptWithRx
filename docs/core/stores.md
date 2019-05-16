# Stores

Stores as well as actions are implemented as RX subjects. The only difference is that actions are pure subjects that just forward the action events posted to them. In contrast stores remember the last state posted to them to hand it out to any new subscriber (a `BehaviorSubject`).

Stores are in some sense similar to react components. They have options to configure them from the outside (similar to props). They have state which they can change over time in response to action events.

They main differences to components are:

- changes to the state of the store can be subscribed by anyone (not just by themselves)
- they provide actions (or are bound to them) by which their state can be influenced from the outside
- and **most importantly** the lifecycle of a store can be managed in any way you desire (in contrast to the automatism by react)

## Creating stores

To create a store you have to define at least three things:

- options
- state
- the store itself

Usually it is good practice to also create an interface for the store that indicates which stuff on the store is important for using it.

**Example:**

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


export class MyStore extends Store<IMyStoreState> implements IMyStore
{
    // make the actual implementation of the action readonly
    // to avoid tempering
    public readonly setNumber: IAction<number>;

    constructor(private options: IMyStoreOptions)
    {
        super({
            ...options,
            initialState: {
                // set default state fields
                someNumber: 0
            }
        });

        // create the actions you defined in the interface
        // you can create and subscribe them in one go
        // stores subscribe actions to get any action events flowing
        // through the action
        this.setNumber = this.createActionAndSubscribe<number>(someNumber => this.onSetNumber(someNumber));
    }

    // to increase overview move all action handlers into separate functions
    private onSetNumber(someNumber: number): void
    {
        this.setState({
            ...this.state,
            someNumber
        });
    }
}
```
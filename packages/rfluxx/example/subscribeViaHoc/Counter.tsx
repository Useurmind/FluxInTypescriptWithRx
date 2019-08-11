import * as React from "react";
import { Subscription } from "rxjs/Subscription";

import { subscribeStoreSelect } from "../../src/withStoreSubscription";

import { IPageStore, IPageStoreState } from "./PageStore";

export interface ICounterProps {
    counter: number;
    increment: () => void;
}

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

// this code binds the component Page to the PageStore
// the actual instance of the page store is not yet given
export const BoundCounter = subscribeStoreSelect<IPageStore, IPageStoreState>()(
    Counter,
    (storeState, store) => ({
        // bind the counter state to this components props
        counter: storeState.counter,
        // bind a call to an action to a handler in this components props
        increment: () => store.increment.trigger(1)
    }));

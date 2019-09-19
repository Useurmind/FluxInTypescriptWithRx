import * as React from "react";
import { Subscription } from "rxjs/Subscription";

import { subscribeStoreSelect } from "../../src/subscription/withStoreSubscription";

import { ICounterStore, ICounterStoreState } from "./CounterStore";
import { useContainer } from '../../src/context/ContainerContext';

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

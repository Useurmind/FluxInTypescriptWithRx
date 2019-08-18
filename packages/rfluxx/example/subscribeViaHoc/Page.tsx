import * as React from "react";
import { Subscription } from "rxjs/Subscription";

import { subscribeStoreSelect } from "../../src/withStoreSubscription";

import { CounterBound } from "./Counter";
import { createCounterStore, ICounterStore } from "./CounterStore";

export interface IPageState {
    counterStore: ICounterStore;
}

export class Page extends React.Component<{}, IPageState>
{
    constructor(props: {})
    {
        super(props);

        this.onResetCounterStore = this.onResetCounterStore.bind(this);

        this.state = {
            counterStore: createCounterStore()
        };
    }

    private onResetCounterStore()
    {
        this.setState({
            ...this.state,
            counterStore: createCounterStore()
        });
    }

    public render(): any
    {
        return <div>
            <button onClick={this.onResetCounterStore}>Reset counter store</button>
            <CounterBound store={this.state.counterStore} />
        </div>;
    }
}

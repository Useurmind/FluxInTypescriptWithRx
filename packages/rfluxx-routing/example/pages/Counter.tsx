import * as React from "react";

import { IPageContextProps, PageContext } from "../../src/PageContextProvider";
import { StoreSubscription } from "../../src/StoreSubscription";

import { ICounterStore, ICounterStoreState } from "./CounterStore";

export interface ICounterProps extends IPageContextProps
{
    caption: string;
}

export interface ICounterState {
    counter: number;
    toldCounter: string;
}

export class Counter extends React.Component<ICounterProps, ICounterState> {
    private subscription: StoreSubscription<ICounterStore, ICounterStoreState> = new StoreSubscription();

    constructor(props: any)
    {
        super(props);

        this.state = {
            counter: 0,
            toldCounter: "/home/route1"
        };
    }

    public componentDidMount()
    {
        console.log("Counter did mount");
    }

    public componentDidUpdate(prevProps: ICounterProps): void
    {
        this.subscription.subscribeStore(
            this.props.container.resolve<ICounterStore>("ICounterStore"),
            state =>
            {
                this.setState({
                    ...this.state,
                    // set the counter in the state of the component to that of the store
                    counter: state.counter
                });
            });
    }

    public componentWillUnmount()
    {
        console.log("Counter unmount");
        // unsubscribe if component is unmounted
        this.subscription.unsubscribe();
    }

    public onIncrement()
    {
        // execute command to increase the counter
        this.subscription.store.increment.trigger(1);
    }

    public onTellOtherCounter()
    {
        // execute command to increase the counter
        this.subscription.store.tellCounter.trigger(this.state.toldCounter);
    }

    public onToldCounterChanged(e: any)
    {
        this.setState({
            ...this.state,
            toldCounter: e.target.value
        });
    }

    public render(): any
    {
        return <div>
            <div>Hello {this.props.caption} {this.state.counter}</div>
            <button onClick={_ => this.onIncrement()} >Increment</button>
            <button onClick={_ => this.onTellOtherCounter()} >Tell other counter</button>
            <label>Told counter:</label>
            <input type="text" onChange={e => this.onToldCounterChanged(e)} value={this.state.toldCounter} />
        </div>;
    }
}

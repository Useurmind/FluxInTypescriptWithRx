import * as React from "react";
import * as Rx from "rxjs";

import { IPageContextProps, PageContext } from "../../src/PageContextProvider";
import { StoreSubscription } from "../../src/StoreSubscription";

import { ICounterStore, ICounterStoreState } from "./CounterStore";

export interface ICounterProps extends IPageContextProps
{
    caption: string;
}

export interface ICounterState {
    counter: number;
}

export class Counter extends React.Component<ICounterProps, ICounterState> {
    private subscription: StoreSubscription<ICounterStore, ICounterStoreState> = new StoreSubscription();

    constructor(props: any)
    {
        super(props);

        this.state = {
            counter: 0
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

    public onClick()
    {
        // execute command to increase the counter
        this.subscription.store.increment.trigger(1);
    }

    public render(): any
    {
        return <div>
            <div>Hello {this.props.caption} {this.state.counter}</div>
            <button onClick={_ => this.onClick()} >Increment</button>
        </div>;
    }
}

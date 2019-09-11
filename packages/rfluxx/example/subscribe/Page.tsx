import * as React from "react";
import { Subscription } from "rxjs/Subscription";

import { IContainer } from "../../src";
import { IRfluxxInitializerWithContainer } from "../../src/Initialization";
import { subscribeStoreSelect } from "../../src/withStoreSubscription";

import { CounterBound } from "./Counter";
import { ICounterStore } from "./CounterStore";
import { FuncCounter } from './FuncCounter';

export interface IPageProps {
    containerFactory: IRfluxxInitializerWithContainer;
}

export interface IPageState {
    container: IContainer;
}

export class Page extends React.Component<IPageProps, IPageState>
{
    constructor(props: IPageProps)
    {
        super(props);

        this.onResetCounterStore = this.onResetCounterStore.bind(this);

        this.state = {
            container: props.containerFactory.build()
        };
    }

    private onResetCounterStore()
    {
        this.setState({
            ...this.state,
            container: this.props.containerFactory.build()
        });
    }

    public render(): any
    {
        return <div>
            <button onClick={this.onResetCounterStore}>Reset counter store</button>
            <CounterBound container={this.state.container} storeRegistrationKey="ICounterStore" />

            <FuncCounter container={this.state.container} storeRegistrationKey="ICounterStore" storeInstanceName="FuncCounterStore" /> 
        </div>;
    }
}

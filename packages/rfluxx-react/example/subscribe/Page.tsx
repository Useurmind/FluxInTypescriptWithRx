import * as React from "react";
import { Subscription } from "rxjs/Subscription";
import { IContainer } from "rfluxx";
import { IRfluxxInitializerWithContainer } from "rfluxx";

import { subscribeStoreSelect } from "../../src/subscription/withStoreSubscription";

import { CounterBound } from "./Counter";
import { ICounterStore } from "./CounterStore";
import { FuncCounter } from './FuncCounter';
import { ContainerContext, ContainerContextProvider, withContainer } from '../../src/context/ContainerContext';

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
        return <ContainerContextProvider container={this.state.container}>
            <div>
                <button onClick={this.onResetCounterStore}>Reset counter store</button>
                { withContainer(<CounterBound storeRegistrationKey="ICounterStore" />) }

                <FuncCounter storeRegistrationKey="ICounterStore" storeInstanceName="FuncCounterStore" /> 
            </div>
        </ContainerContextProvider>;
    }
}

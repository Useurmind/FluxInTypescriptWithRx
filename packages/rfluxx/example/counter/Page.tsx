import * as React from "react";
import { Subscription } from "rxjs/Subscription";

import { pageStore } from "./PageStore";

export interface IPageState {
    counter: number;
}

export class Page extends React.Component<{}, IPageState> {
    private subscription: Subscription;

    constructor(props: any) {
        super(props);

        this.state = {
            counter: 0
        };
    }

    public componentDidMount() {
        // subscribe to the page store instances state
        this.subscription = pageStore.subscribe(state => {
            this.setState({
                ...this.state,
                // set the counter in the state of the component to that of the store
                counter: state.counter
            });
        });
    }

    public componentWillUnmount() {
        // unsubscribe if component is unmounted
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public onClick() {
        // execute command to increase the counter
        pageStore.increment.trigger(1);
    }

    public render(): any {
        return <div>
            <div>Hello Counter {this.state.counter}</div>
            <button onClick={this.onClick} >Increment</button>
        </div>;
    }
}

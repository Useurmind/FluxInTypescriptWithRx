import * as Rx from "rxjs";
import * as React from "react";
import { pageStore } from "./PageStore";

interface IPageState {
    counter: number;
}

export class Page extends React.Component<{}, IPageState> {
    private _subscription: Rx.Subscription;

    constructor(props: any){
        super(props);

        this.state = {
            counter: 0
        }    
    }

    componentDidMount() {
        // subscribe to the page store instances state
        this._subscription = pageStore.subscribe(state => {
            this.setState({
                ...this.state,
                // set the counter in the state of the component to that of the store
                counter: state.counter
            })
        })
    }

    componentWillUnmount() {
        // unsubscribe if component is unmounted
        if(this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onClick() {
        // execute command to increase the counter
        pageStore.increment.execute(1);
    }

    public render(): any {
        return <div>
            <div>Hello Counter {this.state.counter}</div>
            <button onClick={this.onClick} >Increment</button>
        </div>;
    }
}
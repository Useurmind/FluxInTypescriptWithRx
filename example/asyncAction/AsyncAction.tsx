import * as Rx from "rxjs";
import * as React from "react";
import { IAsyncActionStore } from "./IAsyncActionStore";

export interface IAsyncActionProps {
    label: string;
    store: IAsyncActionStore;
}

export interface IAsyncActionState {
    text: string;
}

export class AsyncAction extends React.Component<IAsyncActionProps, IAsyncActionState> {
    private _subscription: Rx.Subscription;

    constructor(props: any){
        super(props);

        this.state = {
            text: "nothing yet"
        }    
    }

    componentDidMount() {
        // subscribe to the page store instances state
        this._subscription = this.props.store.subscribe(state => {
            this.setState({
                ...this.state,
                // set the counter in the state of the component to that of the store
                text: state.error ? state.error : state.dataModel.text
            })
        })
    }

    componentWillUnmount() {
        // unsubscribe if component is unmounted
        if(this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onSuccessClick() {
        // execute command to start successful download
        this.props.store.startSuccessfulDownload.trigger(null);
    }

    onFailClick() {
        // execute command to start failing download
        this.props.store.startFailingDownload.trigger(null);
    }

    public render(): any {
        return <div>
            <h2>{this.props.label}</h2>
            <button onClick={_ => this.onSuccessClick()} >Please succeed</button>
            <button onClick={_ => this.onFailClick()} >Please fail</button>
            <div>Result:</div>
            <div>{this.state.text}</div>
        </div>;
    }
}
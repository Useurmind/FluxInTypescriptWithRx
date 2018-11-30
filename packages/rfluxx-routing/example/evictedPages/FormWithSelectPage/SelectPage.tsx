import * as React from "react";
import * as Rx from "rxjs";

import { IPageContextProps, PageContext } from "../../../src/PageContextProvider";
import { StoreSubscription } from "../../../src/StoreSubscription";

import { ISelectPageStore, ISelectPageStoreState } from "./SelectPageStore";

export interface ISelectPageProps extends IPageContextProps
{
    caption: string;
}

export interface ISelectPageState {
    contextInfo: string;
    selectedString: string;
}

export class SelectPage extends React.Component<ISelectPageProps, ISelectPageState> {
    private subscription: StoreSubscription<ISelectPageStore, ISelectPageStoreState> = new StoreSubscription();

    constructor(props: any)
    {
        super(props);

        this.state = {
            contextInfo: "none given",
            selectedString: ""
        };
    }

    public componentDidMount()
    {
        console.log("SelectPage did mount");
    }

    public componentDidUpdate(prevProps: ISelectPageProps): void
    {
        this.subscription.subscribeStore(
            this.props.container.resolve<ISelectPageStore>("ISelectPageStore"),
            state =>
            {
                this.setState({
                    ...this.state,
                    selectedString: state.selectedString,
                    contextInfo: state.contextInfo
                });
            });
    }

    public componentWillUnmount()
    {
        console.log("SelectPage unmount");
        // unsubscribe if component is unmounted
        this.subscription.unsubscribe();
    }

    public onSelectionChanged(e: any)
    {
        // execute command to increase the SelectPage
        this.subscription.store.setSelection.trigger(e.target.value);
    }

    public onCancel()
    {
        // execute command to increase the SelectPage
        this.subscription.store.cancel.trigger(null);
    }

    public onConfirm()
    {
        this.subscription.store.confirm.trigger(null);
    }

    public render(): any
    {
        return <div>
            <h1>Select a string '{this.props.caption}'</h1>
            <span>Some context:</span>
            <span>{this.state.contextInfo}</span>

            <span>Select a string on this page (yeah its not selected :P):</span>
            <input type="text" onChange={e => this.onSelectionChanged(e)}/>
            <button onClick={e => this.onCancel()}>Cancel</button>
            <button onClick={e => this.onConfirm()}>Confirm</button>
        </div>;
    }
}

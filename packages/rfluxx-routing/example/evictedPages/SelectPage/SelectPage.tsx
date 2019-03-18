import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { IPageContextProps, PageContext } from "../../../src";

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
        // tslint:disable-next-line:no-console
        console.log("SelectPage did mount");

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
        // tslint:disable-next-line:no-console
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
        return <div className="container-fluid">
            <h1>Select a string</h1>
            <p>
                On this page you can select a string that will be handed back to the calling control.
            </p>

            <form>
                <div className="form-group">
                    <label htmlFor="contextInfo">Some Context Info</label>
                    <div className="input-group">
                        <input type="text" className="form-control"
                                disabled={true}
                                id="contextInfo" aria-describedby="contextInfoHelp" placeholder="Context info"
                                value={this.state.contextInfo} />
                    </div>
                    <small id="contextInfoHelp" className="form-text text-muted">
                        Context info can be handed by the calling control to this page.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="selectecTextInput">Selected text</label>
                    <div className="input-group">
                        <input type="text" className="form-control"
                                id="selectecTextInput" aria-describedby="selectecTextInputHelp"
                                placeholder="Select a text"
                                value={this.state.selectedString}
                                onChange={e => this.onSelectionChanged(e)} />
                    </div>
                    <small id="selectecTextInputHelp" className="form-text text-muted">
                        Select a text to hand back to the calling control. Yeah its not selected, you got me.
                    </small>
                </div>

                <div className="btn-toolbar" role="toolbar" >
                        <button type="button" onClick={e => this.onCancel()} className="btn btn-secondary"
                        style={{ marginRight: "5px" }}>Cancel</button>
                        <button type="button" onClick={e => this.onConfirm()} className="btn btn-primary">
                            Confirm
                        </button>
                </div>
            </form>
        </div>;
    }
}

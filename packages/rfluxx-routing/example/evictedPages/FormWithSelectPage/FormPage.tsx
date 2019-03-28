import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { IPageContextProps, PageContext } from "../../../src";

import { IFormPageStore, IFormPageStoreState } from "./FormPageStore";

export interface IFormPageProps extends IPageContextProps
{
}

export interface IFormPageState
{
    selectedString: string;
}

export class FormPage extends React.Component<IFormPageProps, IFormPageState> {
    private subscription: StoreSubscription<IFormPageStore, IFormPageStoreState> = new StoreSubscription();

    constructor(props: any)
    {
        super(props);

        this.state = {
            selectedString: ""
        };
    }

    public componentDidMount()
    {
        // tslint:disable-next-line:no-console
        console.log("FormPage did mount");
        this.subscribeStore();
    }

    public componentDidUpdate(prevProps: IFormPageProps): void
    {
        this.subscribeStore();
    }

    public componentWillUnmount()
    {
        // tslint:disable-next-line:no-console
        console.log("FormPage unmount");
        // unsubscribe if component is unmounted
        this.subscription.unsubscribe();
    }

    public subscribeStore()
    {
        this.subscription.subscribeStore(
            this.props.container.resolve<IFormPageStore>("IFormPageStore"),
            state =>
            {
                this.setState({
                    ...this.state,
                    // set the FormPage in the state of the component to that of the store
                    selectedString: state.selectedString
                });
            });
    }

    public onSelectStringClicked()
    {
        this.subscription.store.selectString.trigger(null);
    }

    public render(): any
    {
        return <div className="container-fluid">
            <h2>Form with select</h2>
            <p>
                This page shows a form control in which you can select a value using another page.
                The communicating pages feature is used here.
            </p>
            <label htmlFor="sequenceNumberInput">Selected String</label>
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"
                          onClick={_ => this.onSelectStringClicked()}>...</span>
                </div>
                <input type="text" className="form-control"
                        id="sequenceNumberInput" aria-describedby="sequenceNumberHelp" placeholder="Select a string"
                        value={this.state.selectedString}
                        readOnly={true}/>
            </div>
            <small id="sequenceNumberHelp" className="form-text text-muted">
                Click the tree dots to select a string from a different page.
            </small>
        </div>;
    }
}

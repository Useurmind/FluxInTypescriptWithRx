import * as React from "react";
import * as Rx from "rxjs";

import { IPageContextProps, PageContext } from "../../../src/PageContextProvider";
import { StoreSubscription } from "../../../src/StoreSubscription";

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
        console.log("FormPage did mount");
    }

    public componentDidUpdate(prevProps: IFormPageProps): void
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

    public componentWillUnmount()
    {
        console.log("FormPage unmount");
        // unsubscribe if component is unmounted
        this.subscription.unsubscribe();
    }

    public onSelectStringClicked()
    {
        this.subscription.store.selectString.trigger(null);
    }

    public render(): any
    {
        return <div>
            <button onClick={_ => this.onSelectStringClicked()}>Select a string</button>
            <span>Selected string</span>
            <span>{this.state.selectedString}</span>
        </div>;
    }
}

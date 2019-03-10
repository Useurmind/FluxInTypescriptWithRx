import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { IPageContextProps, PageContext } from "../../../src/PageContextProvider";
import { RouterLink } from "../../../src/RouterLink";

import { IEndlessSequencePageStore, IEndlessSequencePageStoreState } from "./EndlessSequencePageStore";

export interface IEndlessSequencePageProps extends IPageContextProps
{
}

export interface IEndlessSequencePageState
{
    sequenceNumber: number;
}

export class EndlessSequencePage extends React.Component<IEndlessSequencePageProps, IEndlessSequencePageState> {
    private subscription: StoreSubscription<IEndlessSequencePageStore, IEndlessSequencePageStoreState>
        = new StoreSubscription();

    constructor(props: any)
    {
        super(props);

        this.state = {
            sequenceNumber: -1
        };
    }

    public componentDidMount()
    {
        // tslint:disable-next-line:no-console
        console.log("EndlessSequencePage did mount");
        this.subscribeStore();
    }

    public componentDidUpdate(prevProps: IEndlessSequencePageProps): void
    {
        this.subscribeStore();
    }

    public componentWillUnmount()
    {
        // tslint:disable-next-line:no-console
        console.log("EndlessSequencePage unmount");
        // unsubscribe if component is unmounted
        this.subscription.unsubscribe();
    }

    public subscribeStore()
    {
        this.subscription.subscribeStore(
            this.props.container.resolve<IEndlessSequencePageStore>("IEndlessSequencePageStore"),
            state =>
            {
                this.setState({
                    ...this.state,
                    // set the EndlessSequencePage in the state of the component to that of the store
                    sequenceNumber: state.sequenceNumber
                });
            });
    }

    public render(): any
    {
        return <div className="container-fluid">
            <h2>Endless sequence</h2>
            <p>
                This page shows how a endless sequences state is managed.
                You can navigate back and forth without loosing state.
                Navigating to far away from a page should drop its state.
            </p>
            <label htmlFor="sequenceNumberInput">Sequence number</label>
            <div className="input-group">
                <input type="text" className="form-control"
                        id="sequenceNumberInput" aria-describedby="sequenceNumberHelp"
                        disabled={true}
                        value={this.state.sequenceNumber} />
            </div>
            <RouterLink caption="Next in sequence" path={`/endlessSequence/${this.state.sequenceNumber + 1}`} />
        </div>;
    }
}

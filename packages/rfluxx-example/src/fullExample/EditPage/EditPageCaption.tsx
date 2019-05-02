import * as React from "react";
import { StoreSubscription } from "rfluxx";
import { IPageContextProps, PageContext } from "rfluxx-routing";

import { IEditPageStore, IEditPageStoreState } from "./EditPageStore";

export interface IEditPageCaptionProps extends IPageContextProps
{
}

export interface IEditPageCaptionState
{
    editedText: string;
}

export class EditPageCaption extends React.Component<IEditPageCaptionProps, IEditPageCaptionState> {
    private subscription: StoreSubscription<IEditPageStore, IEditPageStoreState> = new StoreSubscription();

    constructor(props: any)
    {
        super(props);

        this.state = {
            editedText: ""
        };
    }

    public componentDidMount()
    {
        // tslint:disable-next-line:no-console
        console.log("EditPageCaption did mount");
        this.subscribeStore();
    }

    public componentDidUpdate(prevProps: IEditPageCaptionProps): void
    {
        this.subscribeStore();
    }

    public componentWillUnmount()
    {
        // tslint:disable-next-line:no-console
        console.log("EditPageCaption unmount");
        // unsubscribe if component is unmounted
        this.subscription.unsubscribe();
    }

    public subscribeStore()
    {
        this.subscription.subscribeStore(
            this.props.container.resolve<IEditPageStore>("IEditPageStore"),
            state =>
            {
                this.setState({
                    ...this.state,
                    editedText: state.editedString
                });
            });
    }

    public render(): any
    {
        return <span>Edit stuff: {this.state.editedText}</span>
    }
}

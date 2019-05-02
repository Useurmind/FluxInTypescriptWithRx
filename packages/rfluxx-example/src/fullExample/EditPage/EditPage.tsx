import * as React from "react";
import { StoreSubscription } from "rfluxx";
import { IPageContextProps, PageContext } from "rfluxx-routing";

import { IEditPageStore, IEditPageStoreState } from "./EditPageStore";

export interface IEditPageProps extends IPageContextProps
{
}

export interface IEditPageState
{
    isEditing: boolean;
    editedString: string;
}

export class EditPage extends React.Component<IEditPageProps, IEditPageState> {
    private subscription: StoreSubscription<IEditPageStore, IEditPageStoreState> = new StoreSubscription();

    constructor(props: any)
    {
        super(props);

        this.state = {
            isEditing: false,
            editedString: ""
        };
    }

    public componentDidMount()
    {
        // tslint:disable-next-line:no-console
        console.log("EditPage did mount");
        this.subscribeStore();
    }

    public componentDidUpdate(prevProps: IEditPageProps): void
    {
        this.subscribeStore();
    }

    public componentWillUnmount()
    {
        // tslint:disable-next-line:no-console
        console.log("EditPage unmount");
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
                    editedString: state.editedString,
                    isEditing: state.isEditing
                });
            });
    }

    public onEditedStringChanged(e: any)
    {
        const newEditedString = e.target.value;
        this.subscription.store.updateEditedString.trigger(newEditedString);
    }

    public onEditButtonClicked()
    {
        this.subscription.store.setEditing.trigger(!this.state.isEditing);
    }

    public render(): any
    {
        return <div className="container-fluid">
            <h2>Edit page</h2>
            <p>
                This page shows a form control which can be put into edit mode.
                Once in edit mode it may not be evicted.
            </p>
            <label htmlFor="editedStringInput">Edited String</label>
            <div className="input-group">
                <input type="text" className="form-control"
                        id="editedStringInput" aria-describedby="editedStringHelp" placeholder="Type a string"
                        value={this.state.editedString}
                        onChange={e => this.onEditedStringChanged(e)}
                        readOnly={!this.state.isEditing}/>
            </div>
            <small id="editedStringHelp" className="form-text text-muted">
                This text will stay as long as we are editing.
                Even if calling a lot of other pages.
            </small>

            <button className="btn btn-primary" onClick={e => this.onEditButtonClicked()}>
                {this.state.isEditing ? "Save" : "Edit" }
            </button>
        </div>;
    }
}

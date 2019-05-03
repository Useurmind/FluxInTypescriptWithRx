import * as React from "react";
import { StoreSubscription } from "rfluxx";
import { Form, IFormStore, IFormStoreState, StringFormField } from "rfluxx-forms";
import { IPageContextProps, PageContext } from "rfluxx-routing";

import { IFormData } from "./IFormData";

export interface IFormDemoPageProps extends IPageContextProps
{
}

export interface IFormDemoPageState {
}

export class FormDemoPage extends React.Component<IFormDemoPageProps, IFormDemoPageState>
{
    private formStore: IFormStore<IFormData>;

    constructor(props: any)
    {
        super(props);

        this.state = {
            contextInfo: "none given",
            selectedString: ""
        };

        this.formStore = this.props.container.resolve<IFormStore<IFormData>>("IFormStore<IFormData>");
    }

    public render(): any
    {
        return <div className="container-fluid">
            <h1>Select a string</h1>
            <p>
                On this page you can select a string that will be handed back to the calling control.
            </p>

            <Form formStore={this.formStore}>
                <StringFormField getValue={(d: IFormData) => d.firstName}
                                 setValue={(d: IFormData, value: string) => d.firstName = value}
                                 label="First Name"
                                 description="Please enter your first name"
                                 required></StringFormField>
            </Form>
        </div>;
    }
}

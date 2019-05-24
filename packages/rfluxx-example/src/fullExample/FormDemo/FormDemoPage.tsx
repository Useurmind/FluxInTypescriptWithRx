import { Snackbar, Typography, Grid } from "@material-ui/core";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { StoreSubscription } from "rfluxx";
import { Form, IFormStore, IFormStoreState, StringFormField } from "rfluxx-forms";
import { IPageContextProps, PageContext } from "rfluxx-routing";

import { IFormData } from "./IFormData";

export const styles = createStyles({
    root: {

    },
    formData: {
        backgroundColor: "lightgray",
        borderStyle: "dotted",
        borderWidth: "1px",
        borderColor: "gray",
        borderRadius: "5px",
        padding: "10px",
        marginTop: "50px"
    }
});

export interface IFormDemoPageProps extends IPageContextProps, WithStyles<typeof styles>
{
}

export interface IFormDemoPageState {
    formData: IFormData;
}

export const FormDemoPage = withStyles(styles)(
    class extends React.Component<IFormDemoPageProps, IFormDemoPageState>
    {
        private subscription: StoreSubscription<IFormStore<IFormData>, IFormStoreState<IFormData>>
            = new StoreSubscription();

        constructor(props: any)
        {
            super(props);

            this.state = {
                formData: null
            };
        }

        public componentDidMount(): void
        {
            const formStore = this.props.container.resolve<IFormStore<IFormData>>("IFormStore<IFormData>");
            this.subscription.subscribeStore(formStore, s =>
            {
                this.setState({ ...this.state, formData: s.data});
            });
        }

        public componentWillUnmount(): void
        {
            this.subscription.unsubscribe();
        }

        public render(): any
        {
            const { classes, ...rest } = this.props;

            return <div className="container-fluid">
                <h1>Select a string</h1>
                <p>
                    On this page you can select a string that will be handed back to the calling control.
                </p>

                <Form formStore={this.subscription.store}>
                    <Grid container direction="column" spacing={8}>
                        <Grid item>
                            <StringFormField getValue={(d: IFormData) => d.firstName}
                                            setValue={(d: IFormData, value: string) => d.firstName = value}
                                            label="First Name"
                                            description="Please enter your first name"
                                            required></StringFormField>
                        </Grid>
                        <Grid item>
                            <StringFormField getValue={(d: IFormData) => d.lastName}
                                            setValue={(d: IFormData, value: string) => d.lastName = value}
                                            label="Last Name"
                                            description="Please enter your last name"
                                            required></StringFormField>
                        </Grid>
                    </Grid>
                </Form>

                <div className={classes.formData}>
                    <Typography>
                        Here is the data you entered:
                    </Typography>
                    <Typography>
                        { this.state.formData &&
                            <pre>
                                {JSON.stringify(this.state.formData, null, 2)}
                            </pre> }
                    </Typography>
                </div>
            </div>;
        }
    }
);

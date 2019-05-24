import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import * as classNames from "classnames";
import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { FormContext, IFormContext } from "./FormContext";
import { IFormStore, IFormStoreState, ValidationErrors } from "./stores";

type TData = any;

const styles = (theme: Theme) => createStyles({
    root: {
    }
});

/**
 * State for { @see Form }.
 */
export interface IFormState
{
    /**
     * The current data.
     */
    data: TData;

    /**
     * The current validation errors.
     */
    validationErrors: ValidationErrors<TData>;

    /**
     * Additional data for each form field.
     */
    formFieldData: FormFieldDataObject<TData>;
}

/**
 * Props for { @see Form }.
 */
export interface IFormProps
    extends WithStyles<typeof styles>
{
    /**
     * The form store that manages the data of the form.
     */
    formStore: IFormStore<TData>;
}

/**
 * A form provides context information to the form controls inside it.
 * Each form is focused on a single object and managed by a store that
 * loads, validates and saves the data presented and edited in the form.
 */
export const Form = withStyles(styles)(
class extends React.Component<IFormProps, IFormState>
{
    private subscription: StoreSubscription<IFormStore<TData>, IFormStoreState<TData>>
        = new StoreSubscription();

    constructor(props: IFormProps)
    {
        super(props);

        this.state = {
            data: null,
            validationErrors: null
        };
    }

    public componentDidMount()
    {
        this.subscribeStore();
    }

    public componentDidUpdate(): void
    {
        this.subscribeStore();
    }

    public componentWillUnmount()
    {
        // unsubscribe if component is unmounted
        this.subscription.unsubscribe();
    }

    private subscribeStore()
    {
        this.subscription.subscribeStore(
            this.props.formStore,
            state =>
            {
                this.setState({
                    ...this.state,
                    data: state.data,
                    validationErrors: state.validationErrors
                });
            });
    }

    public render(): any
    {
        const { classes, ...rest} = this.props;

        return <div className={classes.root}>
            <FormContext.Provider value={{
                formStore: this.props.formStore,
                data: this.state.data,
                validationErrors: this.state.validationErrors,
                formFieldData: this.state.formFieldData
            }}>
                {this.props.children}
            </FormContext.Provider>
        </div>;
    }
}
);
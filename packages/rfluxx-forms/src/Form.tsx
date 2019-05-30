import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import * as classNames from "classnames";
import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { FormContext, IFormContext } from "./FormContext";
import { IFormStore, IFormStoreState, ValidationErrors } from "./stores";
import { FormFieldDataObject } from "./stores/FormFieldData";

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
        constructor(props: IFormProps)
        {
            super(props);

            this.state = {
            };
        }

        public render(): any
        {
            const { classes, ...rest} = this.props;

            return <div className={classes.root}>
                <FormContext.Provider value={{
                    formStore: this.props.formStore
                }}>
                    {this.props.children}
                </FormContext.Provider>
            </div>;
        }
    }
);
import { createStyles, FormControl, FormControlLabel, FormHelperText, Input, InputLabel, TextField, Theme, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";

import { FormContext } from "../FormContext";

import { FormFieldInnerAdapter } from "./FormFieldInnerAdapter";
import { IFormFieldBindingProps, IFormFieldContextProps } from "./IFormFieldContextProps";

type TData = any;
type TValue = any;

const styles = (theme: Theme) => createStyles({
    root: {
    }
});

/**
 * State for { @see FormFieldAdapter }.
 */
export interface IFormFieldAdapterState
{
}

/**
 * Props for { @see FormFieldAdapter }.
 */
export interface IFormFieldAdapterProps extends WithStyles<typeof styles>, IFormFieldBindingProps<TData, string>
{
    /**
     * The children of this component must be a function that takes all the form field props as input.
     */
    children: (formFieldProps: IFormFieldContextProps<TData, TValue>) => React.ReactNode;
}

export const FormFieldAdapter = withStyles(styles)(
    class extends React.PureComponent<IFormFieldAdapterProps, IFormFieldAdapterState>
    {

        constructor(props: IFormFieldAdapterProps)
        {
            super(props);

            this.state = {
            };
        }

        public render(): any
        {
            const { classes, getValue, ...rest } = this.props;

            return <FormContext.Consumer>{context =>
            {
                if (!context.formStore)
                {
                    return null;
                }

                return <FormFieldInnerAdapter formStore={context.formStore}
                                              getValue={this.props.getValue}
                                              setValue={this.props.setValue}>
                    { this.props.children}
                </FormFieldInnerAdapter>;
            }}
            </FormContext.Consumer>;
        }
    }
);

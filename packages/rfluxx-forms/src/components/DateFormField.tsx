import { createStyles, FormControl, FormControlLabel, FormHelperText, Input, InputLabel, TextField, Theme, WithStyles, withStyles } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import * as React from "react";

import { FormFieldFrame } from "./FormFieldFrame";
import { IFormFieldBindingProps, IFormFieldContextProps } from "./IFormFieldContextProps";
import { IFormFieldProps } from './IFormFieldProps';

type TData = any;

const styles = (theme: Theme) => createStyles({
    root: {
    },
    label: {
    },
    input: {
    },
    error: {
    },
    description: {
    }
});

/**
 * State for { @see DateFormField }.
 */
export interface IDateFormFieldState
{
}

/**
 * Props for { @see DateFormField }.
 */
export interface IDateFormFieldProps
    extends WithStyles<typeof styles>, IFormFieldProps, IFormFieldBindingProps<TData, string>
{
}

export const DateFormField = withStyles(styles)(
    class extends React.Component<IDateFormFieldProps, IDateFormFieldState>
    {

        constructor(props: IDateFormFieldProps)
        {
            super(props);

            this.state = {
            };
        }

        public render(): any
        {
            const { classes, ...rest } = this.props;
            const { label, ...frameProps} = this.props;


            return <FormFieldFrame {...frameProps}>
                { (formFieldProps, inputKey) =>
                {
                    return <DatePicker className={classes.input}
                                       label={label}
                                       required={this.props.required}
                                       value={new Date(formFieldProps.value)}
                                       onChange={date => formFieldProps.onValueChanged(date.toJSON())}
                                       error={formFieldProps.hasError}
                                       id={inputKey} />;
                }}
            </FormFieldFrame>;
        }
    }
);

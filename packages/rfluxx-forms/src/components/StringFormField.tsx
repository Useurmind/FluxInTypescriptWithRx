import { createStyles, FormControl, FormControlLabel, FormHelperText, Input, InputLabel, TextField, Theme, WithStyles, withStyles } from "@material-ui/core";
import { InputProps } from "@material-ui/core/Input";
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
 * State for { @see StringFormField }.
 */
export interface IStringFormFieldState
{
}

/**
 * Props for { @see StringFormField }.
 */
export interface IStringFormFieldProps
    extends WithStyles<typeof styles>, IFormFieldProps, IFormFieldBindingProps<TData, string>
{
}

export const StringFormField = withStyles(styles)(
    class extends React.Component<IStringFormFieldProps, IStringFormFieldState>
    {

        constructor(props: IStringFormFieldProps)
        {
            super(props);

            this.state = {
            };
        }

        public render(): any
        {
            const { classes, ...rest } = this.props;


            return <FormFieldFrame {...this.props}>
                { (formFieldProps, inputKey) =>
                {
                    return <Input className={classes.input}
                                  required={this.props.required}
                                  value={formFieldProps.value}
                                  onChange={e => formFieldProps.onValueChanged(e.target.value)}
                                  error={formFieldProps.hasError}
                                  id={inputKey} />;
                }}
            </FormFieldFrame>;
        }
    }
);

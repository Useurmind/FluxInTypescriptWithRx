import { createStyles, FormControl, FormControlLabel, FormHelperText, Input, InputLabel, MenuItem, Select, TextField, Theme, withStyles, WithStyles } from "@material-ui/core";
import { SelectProps } from "@material-ui/core/Select";
import * as React from "react";

import { FormFieldFrame } from "./FormFieldFrame";
import { IFormFieldBindingProps, IFormFieldProps } from "./IFormFieldProps";

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
 * You can either select objects or string values.
 */
export type SelectableValue = string | ISelectableObject;

/**
 * Interface for an object that can be selected.
 */
export interface ISelectableObject {
    /**
     * A unique id for the value.
     */
    id: number;

    /**
     * A caption to show for the value.
     */
    caption: string;
}

/**
 * State for { @see SelectFormField }.
 */
export interface ISelectFormFieldState
{
}

/**
 * Props for { @see SelectFormField }.
 */
export interface ISelectFormFieldProps extends WithStyles<typeof styles>, IFormFieldBindingProps<TData, any>
{
    /**
     * Label for the select field.
     */
    label?: string;

    /**
     * Is this input field required.
     */
    required?: boolean;

    /**
     * A helpfull text that describes the field.
     */
    description?: string;

    /**
     * The values that can be seleceted.
     */
    values: SelectableValue[];
}

export const SelectFormField = withStyles(styles)(
    class extends React.Component<ISelectFormFieldProps, ISelectFormFieldState>
    {

        constructor(props: ISelectFormFieldProps)
        {
            super(props);

            this.state = {
            };
        }

        public render(): any
        {
            const { classes, ...rest } = this.props;

            return <FormFieldFrame {...this.props} getInputProps={getInputProps}>
                <Select className={classes.input}
                        required={this.props.required}>
                    { this.props.values.map(val =>
                        {
                            let caption: string = val as string;
                            let id: any = val;
                            if (typeof val !== "string")
                            {
                                caption = val.caption;
                                id = val.id;
                            }

                            return <MenuItem key={id} value={id}>{caption}</MenuItem>;
                        })}
                </Select>;
            </FormFieldFrame>;
        }
    }
);

function getInputProps(formFieldProps: IFormFieldProps<any, any>): SelectProps
{
    return {
        value: formFieldProps.value,
        error: formFieldProps.hasError,
        onChange: e => formFieldProps.onValueChanged(e.target.value)
    };
}

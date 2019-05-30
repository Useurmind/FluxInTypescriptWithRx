import { createStyles, FormControl, FormControlLabel, FormHelperText, InputLabel, TextField, Theme, WithStyles, withStyles, Input } from "@material-ui/core";
import * as classNames from "classnames";
import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { FormContext } from "../FormContext";
import { IFormStore, IFormStoreState } from "../stores/IFormStore";
import { RenderError } from "../stores/Validation";

import { FormFieldAdapter } from "./FormFieldAdapter";
import { IFormFieldBindingProps } from "./IFormFieldProps";

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
export interface IStringFormFieldProps extends WithStyles<typeof styles>, IFormFieldBindingProps<TData, string>
{
    /**
     * Label for the text field.
     */
    label?: string;

    /**
     * Is this input field required.
     */
    required?: boolean;

    /**
     * A helpfull text that describes the text field.
     */
    description?: string;
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

            return <FormFieldAdapter setValue={this.props.setValue}
                                     getValue={this.props.getValue}>
                    {formFieldProps =>
                    {
                        return <FormControl className={classes.root}>
                            { this.props.label &&
                                <InputLabel error={formFieldProps.hasError}
                                            className={classes.label}
                                            required={this.props.required}>{this.props.label}</InputLabel>}
                            <Input value={formFieldProps.value}
                                error={formFieldProps.hasError}
                                onChange={e => formFieldProps.onValueChanged(e.target.value)}
                                className={classes.input}
                                required={this.props.required} />
                            { formFieldProps.hasError && <FormHelperText className={classes.error}
                                                                         error={true}>{formFieldProps.renderError()}</FormHelperText>}
                            { this.props.description && <FormHelperText className={classes.description}
                                                                        error={false}>{this.props.description}</FormHelperText>}
                        </FormControl>;
                    }}
            </FormFieldAdapter>;
        }
    }
);

import { createStyles, FormControl, FormControlLabel, FormHelperText, InputLabel, TextField, Theme, WithStyles, withStyles, Input } from "@material-ui/core";
import * as classNames from "classnames";
import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { FormContext } from "../FormContext";
import { IFormStore, IFormStoreState } from "../stores/IFormStore";
import { RenderError } from "../stores/Validation";

import { FormFieldAdapter } from "./FormFieldAdapter";
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
 * State for { @see FormFieldFrame }.
 */
export interface IFormFieldFrameState
{
}

/**
 * Props for { @see FormFieldFrame }.
 */
export interface IFormFieldFrameProps extends WithStyles<typeof styles>, IFormFieldBindingProps<TData, any>
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
     * Function to get the props for the input element from the form field props.
     */
    children: (formFieldProps: IFormFieldProps<any, any>, inputId: string) => any;
}

/**
 * This is a common frame used for most form fields.
 */
export const FormFieldFrame = withStyles(styles)(
    class extends React.PureComponent<IFormFieldFrameProps, IFormFieldFrameState>
    {

        constructor(props: IFormFieldFrameProps)
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
                        const inputId = this.props.label;

                        return <FormControl className={classes.root}>
                            { this.props.label &&
                                <InputLabel error={formFieldProps.hasError}
                                            className={classes.label}
                                            required={this.props.required}
                                            htmlFor={inputId}
                                            key="label">{this.props.label}</InputLabel>}
                            { this.props.children(formFieldProps, inputId) }
                            { formFieldProps.hasError &&
                             <FormHelperText className={classes.error}
                                             error={true}
                                             key="errorText">{formFieldProps.renderError()}</FormHelperText>}
                            { this.props.description &&
                             <FormHelperText className={classes.description}
                                             error={false}
                                             key="descriptionText">{this.props.description}</FormHelperText>}
                        </FormControl>;
                    }}
            </FormFieldAdapter>;
        }
    }
);

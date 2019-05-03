import { createStyles, FormControl, FormControlLabel, FormHelperText, InputLabel, TextField, Theme, WithStyles, withStyles, Input } from "@material-ui/core";
import * as classNames from "classnames";
import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { FormContext } from "../FormContext";
import { IFormStore, IFormStoreState } from "../stores/IFormStore";
import { RenderError } from "../stores/Validation";

import { IFormFieldProps } from "./IFormFieldProps";

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
export interface IStringFormFieldProps extends WithStyles<typeof styles>, IFormFieldProps<TData, string>
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
                value: "",
                renderError: null,
                hasError: false
            };
        }

        private onTextFieldChange(formStore: IFormStore<TData>, e: any): void
        {
            formStore.updateDataField.trigger({
                setDataField: this.props.setValue,
                value: e.target.value
            });
        }

        public render(): any
        {
            const { classes, ...rest } = this.props;

            return <FormContext.Consumer>{context =>
            {
                if (!context.data)
                {
                    return null;
                }

                const value = this.props.getValue(context.data);
                const renderError = this.props.getValue(context.validationErrors) as any;
                const hasError = renderError != null;

                return <FormControl className={classes.root}>
                    { this.props.label &&
                        <InputLabel error={hasError}
                                    className={classes.label}
                                    required={this.props.required}>{this.props.label}</InputLabel>}
                    <Input value={value}
                           error={hasError}
                           onChange={e => this.onTextFieldChange(context.formStore, e)}
                           className={classes.input}
                           required={this.props.required} />
                    { hasError && <FormHelperText className={classes.error}
                                                  error={true}>{renderError()}</FormHelperText>}
                    { this.props.description && <FormHelperText className={classes.description}
                                                                error={false}>{this.props.description}</FormHelperText>}
                </FormControl>;
            }}
            </FormContext.Consumer>;
        }
    }
);

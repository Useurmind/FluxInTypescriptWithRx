import { createStyles, FormControl, FormControlLabel, FormHelperText, InputLabel, TextField, Theme, WithStyles, withStyles, Input } from "@material-ui/core";
import * as classNames from "classnames";
import * as React from "react";
import { StoreSubscription } from "rfluxx";

import { FormContext } from "../FormContext";
import { IFormStore, IFormStoreState } from "../stores/IFormStore";
import { RenderError } from "../stores/Validation";

import { IFormFieldBindingProps, IFormFieldProps } from "./IFormFieldProps";

type TData = any;
type TValue = any;

const styles = (theme: Theme) => createStyles({
    root: {
    }
});

/**
 * State for { @see FormFieldInnerAdapter }.
 */
export interface IFormFieldInnerAdapterState
{
    /**
     * The current value for the form field.
     */
    value: any;

    /**
     * A function that renders an error.
     */
    renderError: (() => React.ReactNode) | null;

    /**
     * Indicates whether the form field has a validation error.
     */
    hasError: boolean;
}

/**
 * Props for { @see FormFieldInnerAdapter }.
 */
export interface IFormFieldInnerAdapterProps extends WithStyles<typeof styles>, IFormFieldBindingProps<TData, TValue>
{
    /**
     * The form to store to bind to.
     */
    formStore: IFormStore<TData>;

    /**
     * The children of this component must be a function that takes all the form field props as input.
     */
    children: (formFieldProps: IFormFieldProps<TData, TValue>) => React.ReactNode;
}

export const FormFieldInnerAdapter = withStyles(styles)(
    class extends React.Component<IFormFieldInnerAdapterProps, IFormFieldInnerAdapterState>
    {
        private subscription: StoreSubscription<IFormStore<TData>, IFormStoreState<TData>> = new StoreSubscription();

        constructor(props: IFormFieldInnerAdapterProps)
        {
            super(props);

            this.state = {
                value: null,
                renderError: null,
                hasError: false
            };

            this.onValueChanged = this.onValueChanged.bind(this);
        }

        public componentDidMount(): void
        {
            console.info("form field adapter mounted");
            this.subscription.subscribeStore(this.props.formStore, s =>
            {
                const value = this.props.getValue(s.data);
                const renderError = this.props.getValue(s.validationErrors) as any as ((() => React.ReactNode) | null);
                const hasError = renderError != null;

                console.info("form field adapter set state");
                this.setState({
                    ...this.state,
                    value,
                    renderError,
                    hasError
                });
            });
        }

        public componentWillUnmount(): void
        {
            console.info("form field adapter unmounted");
            this.subscription.unsubscribe();
        }

        private onValueChanged(value: any): void
        {
            this.props.formStore.updateDataField.trigger({
                setDataField: this.props.setValue,
                value
            });
        }

        public render(): any
        {
            const { classes, ...rest } = this.props;

            return <React.Fragment>
                { this.props.children({
                    getValue: this.props.getValue,
                    setValue: this.props.setValue,
                    hasError: this.state.hasError,
                    renderError: this.state.renderError,
                    value: this.state.value,
                    onValueChanged: this.onValueChanged,
                    isReadOnly: false
                })}
            </React.Fragment>;
        }
    }
);

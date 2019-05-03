import * as React from "react";
import { createStyles, WithStyles, withStyles, Theme, TextField } from "@material-ui/core";
import * as classNames from "classnames";
import { FormContext } from "../FormContext";
import { IFormFieldProps } from "./IFormFieldProps";
import { IFormStore, IFormStoreState } from "../IFormStore";
import { StoreSubscription } from "rfluxx";

type TData = any;

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

export interface IStringFormFieldState
{
    value: string;
}

export interface IStringFormFieldProps extends WithStyles<typeof styles>, IFormFieldProps<TData, string>
{
}

export const StringFormField = withStyles(styles)(
    class extends React.Component<IStringFormFieldProps, IStringFormFieldState>
    {
        private storeSubscription: StoreSubscription<IFormStore<TData>, IFormStoreState<TData>> = new StoreSubscription();

        constructor(props: IStringFormFieldProps)
        {
            super(props);

            this.state = {
                value: ""
            };
        }

        private setAndSubscribeFormStore(formStore: IFormStore<TData>)
        {
            if (this.storeSubscription.store != formStore)
            {
                this.storeSubscription.unsubscribe();
                this.storeSubscription.subscribeStore(formStore, s =>
                {
                    this.setState({
                        ...this.state,
                        value: this.props.getValue(s.data)
                    })
                });
            }
        }

        private onTextFieldChange(e: any): void
        {
            this.storeSubscription.store.updateDataField.trigger({
                setDataField: this.props.setValue,
                value: e.target.value
            });
        }

        public render(): any
        {
            const { classes, ...rest } = this.props;

            return <FormContext.Consumer>{context =>
            {
                this.setAndSubscribeFormStore(context.formStore);

                return <TextField value={this.state.value} onChange={e => this.onTextFieldChange(e)}/>
            }}
            </FormContext.Consumer>;
        }
    }
);
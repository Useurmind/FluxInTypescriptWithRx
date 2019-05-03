import * as React from "react";
import { createStyles, WithStyles, withStyles, Theme } from "@material-ui/core";
import * as classNames from "classnames";
import { FormContext, IFormContext } from "./FormContext";

const styles = (theme: Theme) => createStyles({
    root: {
    },
});

export interface IFormState
{
}

export interface IFormProps 
    extends WithStyles<typeof styles>, IFormContext
{
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
            <FormContext.Provider value={this.props}>
                {this.props.children}
            </FormContext.Provider>
        </div>;
    }
}
);
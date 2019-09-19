import { createStyles, Theme, WithStyles } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { subscribeStoreSelect } from "rfluxx-react";

import { IBoundPageStore, IBoundPageStoreState } from "./BoundPageStore";

export const styles = (theme: Theme) => createStyles({
    root: {
    }
});

/**
 * State for { @BoundPage }
 */
export interface IBoundPageState
{

}

/**
 * Props for { @BoundPage }
 */
export interface IBoundPageProps
    extends WithStyles<typeof styles>
{
    /**
     * A string prop that can be shown.
     */
    someString: string;

    /**
     * A handler to set the value of the string prop.
     */
    setString: (evt: React.ChangeEvent) => void;
}

/**
 * Component that shows how to bind a page directly to the store.
 */
export const BoundPage = withStyles(styles)(
    class extends React.Component<IBoundPageProps, IBoundPageState>
    {
        /**
         * Renders the component.
         */
        public render(): React.ReactNode
        {
            const { classes, ...rest } = this.props;

            return <input type="text"
                          value={this.props.someString}
                          onChange={this.props.setString}
                          className={classes.root}/>;
        }
    }
);

// this code binds the component to the BoundPageStore
// the actual instance of the BoundPageStore is not yet given
export const BoundPageBound = subscribeStoreSelect<IBoundPageStore, IBoundPageStoreState>()(
    BoundPage,
    (storeState, store) => ({
        // bind the stores state to this components props
        someString: storeState.someString,
        // bind a call to an action to a handler in this components props
        setString: e => store.setString.trigger(e.target.value)
    })
);

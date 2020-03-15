import { createStyles, Modal, Paper, Theme, WithStyles, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { useCallback } from "react";
import { IUseStoreFromContainerContextProps, useStoreStateFromContainerContext } from "rfluxx-react";

import { IDebugWindowStore, IDebugWindowStoreState } from "./DebugWindowStore";

import CloseIcon from "@material-ui/icons/Close";
import { DebugWindowContent } from './DebugWindowContent';

export const styles = (theme: Theme) => createStyles({
    root: {
    },
    button: {
    }
});

/**
 * Props for { @DebugWindow }
 */
export interface IDebugWindowProps
    extends WithStyles<typeof styles>, IUseStoreFromContainerContextProps
{
}

/**
 * Implementation of DebugWindow.
 */
const DebugWindowImpl: React.FunctionComponent<IDebugWindowProps> = props => {
    const { classes } = props;

    const [ storeState, store ] = useStoreStateFromContainerContext<IDebugWindowStore, IDebugWindowStoreState>(props);
    const toggleOpen = useCallback(() => store.toggleOpen(), [ store ]);

    if (!storeState)
    {
        return null;
    }

    const buttonText = storeState.isOpen ? "Hide Debug Window" : "Show Debug Window"

    return <div className={classes.root}>
        <Button className={classes.button}
                    onClick={toggleOpen}>{buttonText}</Button>
        <Dialog open={storeState.isOpen}
                onClose={toggleOpen}>
            <DialogTitle>RFluXX Debug Window</DialogTitle>
            <DialogContent>
                <DebugWindowContent storeRegistrationKey={props.storeRegistrationKey}></DebugWindowContent>
            </DialogContent>
            <DialogActions>
                <Button className={classes.button}
                        onClick={toggleOpen}>Hide</Button>
            </DialogActions>
        </Dialog>
    </div>;
};

/**
 * Component that shows the debug window for an rfluxx app.
 */
export const DebugWindow = withStyles(styles)(DebugWindowImpl);

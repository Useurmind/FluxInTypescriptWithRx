import { createStyles, Modal, Paper, Theme, WithStyles, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel } from "@material-ui/core";
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
    dialog: {
    },
    paper: {        
        width: "90%",
        height: "90%"
    },
    button: {
    }
});

// function PaperComponent(props) {
//     return (
//       <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
//         <Paper {...props} />
//       </Draggable>
//     );
//   }

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
    const clear = useCallback(() => store.clear(), [ store ]);
    const toggleRecording = useCallback(() => store.toggleRecording(), [ store ]);

    if (!storeState)
    {
        return null;
    }

    const buttonText = storeState.isOpen ? "Hide Debug Window" : "Show Debug Window"

    return <div className={classes.root}>
        <Button className={classes.button}
                    onClick={toggleOpen}>{buttonText}</Button>
        <Dialog open={storeState.isOpen}
                onClose={toggleOpen}
                fullWidth
                maxWidth="lg"
                className={classes.dialog}
                >
            <DialogTitle>RFluXX Debug Window</DialogTitle>
            <DialogContent>
                <DebugWindowContent storeRegistrationKey={props.storeRegistrationKey}></DebugWindowContent>
            </DialogContent>
            <DialogActions>
                
                <FormControlLabel control={
                                    <Switch checked={storeState.isRecording}
                                            onChange={toggleRecording}></Switch>
                                    } label="Record?" />
                
                <Button className={classes.button}
                        onClick={clear}>Clear</Button>
                <Button className={classes.button}
                        onClick={toggleOpen}
                        variant="contained">Hide</Button>
            </DialogActions>
        </Dialog>
    </div>;
};

/**
 * Component that shows the debug window for an rfluxx app.
 */
export const DebugWindow = withStyles(styles)(DebugWindowImpl);

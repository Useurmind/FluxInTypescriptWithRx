import { createStyles, Theme, WithStyles, Typography, TextField } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { useCallback } from "react";
import { IUseStoreFromContainerContextProps, useStoreStateFromContainerContext } from "rfluxx-react";

import { IUseParametersStore, IUseParametersStoreState } from "./UseParametersStore";
import { RouterLink } from 'rfluxx-routing';

export const styles = (theme: Theme) => createStyles({
    root: {
    }
});

/**
 * Props for { @UseParametersPage }
 */
export interface IUseParametersPageProps
    extends WithStyles<typeof styles>
{
}

/**
 * Implementation of UseParametersPage.
 */
const UseParametersPageImpl: React.FunctionComponent<IUseParametersPageProps> = props => {
    const { classes } = props;

    const [nextParam, setNextParam] = React.useState("");

    const [ storeState, store ] = useStoreStateFromContainerContext<IUseParametersStore, IUseParametersStoreState>({
        storeRegistrationKey: "IUseParametersStore"
    });

    if (!storeState)
    {
        return null;
    }

    return <div className={classes.root}>
        <TextField id="standard-basic" label="Next Parameter Value" value={nextParam} onChange={e => setNextParam(e.target.value)} />
        <RouterLink path={"home/store/uses/parameter/" + nextParam}>Go to next Param</RouterLink>
        <Typography>Current parameter value</Typography>
        <Typography>{storeState.parameterValue}</Typography>
    </div>;
};

/**
 * Component that .
 */
export const UseParametersPage = withStyles(styles)(UseParametersPageImpl);

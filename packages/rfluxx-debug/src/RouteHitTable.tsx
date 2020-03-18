import { createStyles, Theme, WithStyles, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { useCallback } from "react";
import { IUseStoreFromContainerContextProps, useStoreStateFromContainerContext } from "rfluxx-react";

import { IRouteHitStore, IRouteHitStoreState } from "./RouteHitStore";
import { RouteParameters } from 'rfluxx-routing/src';

const styles = (theme: Theme) => createStyles({
    root: {
    },
    table: {},
    chipContainer: {
      display: "flex",
      flexWrap: "wrap",
      '& > *': {
        margin: theme.spacing(0.5),
      },
    }
});

/**
 * Props for { @RouteHitTable }
 */
export interface IRouteHitTableProps
    extends WithStyles<typeof styles>
{
}

/**
 * Implementation of RouteHitTable.
 */
const RouteHitTableImpl: React.FunctionComponent<IRouteHitTableProps> = props => {
    const { classes } = props;

    const [ storeState, store ] = useStoreStateFromContainerContext<IRouteHitStore, IRouteHitStoreState>({
        storeRegistrationKey: "IRouteHitStore"
    });
    // const  = useCallback(() => store..trigger(1), [ store ]);

    if (!storeState)
    {
        return null;
    }

    return <div className={classes.root}>
        <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Route</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Parameters</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {storeState.routeHits.map(row => (
            <TableRow key={row.time.getTime()}>
              <TableCell component="th" scope="row">
                {row.time.toLocaleString()}
              </TableCell>
              <TableCell>{row.value.route.expression}</TableCell>
              <TableCell>{row.value.url.href}</TableCell>
              <TableCell>{renderParameters(classes, row.value.parameters)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>;
};

function renderParameters(classes: any, routeParameters: RouteParameters): React.ReactNode {
  return <div className={classes.chipContainer}>
    {Array.from(routeParameters.keys()).map(k => {
      const chipLabel = `${k}: ${routeParameters.get(k)}`;
      return <Chip label={chipLabel} />
    })
    }
  </div>
}

/**
 * Component that shows the route rits recorded so far.
 */
export const RouteHitTable = withStyles(styles)(RouteHitTableImpl);

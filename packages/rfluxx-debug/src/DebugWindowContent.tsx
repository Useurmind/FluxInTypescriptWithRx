import { createStyles, Theme, WithStyles, Tabs, Tab } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { useCallback } from "react";
import { IUseStoreFromContainerContextProps, useStoreStateFromContainerContext } from "rfluxx-react";

import { IDebugWindowStore, IDebugWindowStoreState, DebugWindowTabs } from "./DebugWindowStore";
import { RouteHitTable } from './RouteHitTable';

const styles = (theme: Theme) => createStyles({
    root: {
    }
});

/**
 * Props for { @DebugWindowContent }
 */
export interface IDebugWindowContentProps
    extends WithStyles<typeof styles>, IUseStoreFromContainerContextProps
{
}

interface TabPanelProps {
    selectedTab: DebugWindowTabs;
    showTab: DebugWindowTabs;
}

const TabPanel: React.FunctionComponent<TabPanelProps> = props => {
    return props.selectedTab === props.showTab && <div>{props.children}</div>;
}

/**
 * Implementation of DebugWindowContent.
 */
const DebugWindowContentImpl: React.FunctionComponent<IDebugWindowContentProps> = props => {
    const { classes } = props;

    const [ storeState, store ] = useStoreStateFromContainerContext<IDebugWindowStore, IDebugWindowStoreState>(props);
    const setActiveTab = useCallback((event, value: DebugWindowTabs) => store.setActiveTab(value), [ store ]);

    if (!storeState)
    {
        return null;
    }

    return <div className={classes.root}>
        <Tabs value={storeState.activeTab} onChange={setActiveTab}>
            <Tab label="Route Hits" />
            <Tab label="Other" />
        </Tabs>
        <TabPanel selectedTab={storeState.activeTab} showTab={DebugWindowTabs.RouteHits}>
            <RouteHitTable />
        </TabPanel>
        <TabPanel selectedTab={storeState.activeTab} showTab={DebugWindowTabs.Other}>
            Other
        </TabPanel>
    </div>;
};

/**
 * Component that shows the content of a debug window.
 */
export const DebugWindowContent = withStyles(styles)(DebugWindowContentImpl);

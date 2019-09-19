// import createStyles from "@material-ui/styles/createStyles";
// import withStyles, {  WithStyles } from "@material-ui/styles/withStyles";
import { createStyles, withStyles, WithStyles } from "@material-ui/styles";
import * as React from "react";
import { StoreSubscription } from "rfluxx";
import { Subscription } from "rxjs/Subscription";

import { RouterLink } from "../RouterLink";
import { getSiteMapNodeCaption, getSiteMapNodeSideBarUrl, ISiteMapNode, shouldSiteMapNodeRenderInSideBar } from "../SiteMap/ISiteMapNode";
import { ISiteMapStore, ISiteMapStoreState } from "../SiteMap/SiteMapStore";
import { IPageContextProps } from "../PageContext";

const styles = createStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        paddingLeft: "15px",
        paddingRight: "15px",
    },
    linkContainer: {
        paddingTop: "15px"
    }
});

/**
 * Props for { @see SideBar }.
 */
export interface ISideBarProps 
    extends IPageContextProps, WithStyles<typeof styles>
{
    /**
     * The site map store that states the currently active site map node.
     * If the site map store is not given the SideBar will try to retrieve it from the container.
     */
    siteMapStore?: ISiteMapStore;

    /**
     * Should the given site map node be rendered.
     * If not the next deeper site map node will be
     */
    shouldRenderNode?: (node: ISiteMapNode, depth: number) => boolean;

    /**
     * Render one node of the SideBar. By default renders a bootstrap nav entry.
     */
    renderNode?: (node: ISiteMapNode, depth: number) => any;
}

/**
 * State for { @see SideBar }.
 */
export interface ISideBarState
{
    /**
     * The root site map node of the site map.
     */
    siteMap: ISiteMapNode;
}

/**
 * The SideBar renders the site map of the site in a side bar like view.
 */
export const SideBar = withStyles(styles)(
class extends React.Component<ISideBarProps, ISideBarState>
{
    private subscription: StoreSubscription<ISiteMapStore, ISiteMapStoreState>
        = new StoreSubscription();

    constructor(props: ISideBarProps)
    {
        super(props);

        this.state = {
            siteMap: null
        };
    }

    /**
     * @inheritDoc
     */
    public componentDidMount()
    {
        const store = this.props.siteMapStore
                        ? this.props.siteMapStore
                        : this.props.container.resolve<ISiteMapStore>("ISiteMapStore");

        if (!store)
        {
            throw Error("The site map store in the SideBar was neither given through the props"
                        + " nor was a container passed to the props.");
        }

        this.subscription.subscribeStore(
            store,
            x => this.setState({
                ...this.state,
                siteMap:  x.siteMap}));
    }

    /**
     * @inheritDoc
     */
    public componentWillUnmount()
    {
        this.subscription.unsubscribe();
    }

    /**
     * @inheritDoc
     */
    public render(): any
    {
        const renderNode = this.props.renderNode
                                ? this.props.renderNode
                                : (sn: ISiteMapNode, depth: number) =>
                                {
                                    if (!shouldSiteMapNodeRenderInSideBar(sn))
                                    {
                                        return null;
                                    }

                                    const urlPath = getSiteMapNodeSideBarUrl(sn);

                                    const caption = getSiteMapNodeCaption(sn, this.props.routeParameters);

                                    return <div className={this.props.classes.linkContainer}>
                                        <RouterLink caption={caption} path={urlPath} />
                                    </div>;
                                };

        return <nav aria-label="SideBar" className={this.props.classes.root}>
            {
                this.state.siteMap &&
                flattenSiteMap(this.state.siteMap).map(node => renderNode(node, 0))
            }
            {
                !this.state.siteMap &&
                "No site map given"
            }
        </nav>;
    }
}
);

function flattenSiteMap(siteMap: ISiteMapNode): ISiteMapNode[]
{
    let nodeList = [siteMap];

    if (siteMap.children && siteMap.children.length > 0)
    {
        for (const child of siteMap.children)
        {
            nodeList = [...nodeList, ...flattenSiteMap(child)];
        }
    }

    return nodeList;
}

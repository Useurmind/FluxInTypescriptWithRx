import * as React from "react";
import { StoreSubscription } from "rfluxx";
import { Subscription } from "rxjs/Subscription";

import { IPageContextProps } from "../PageContextProvider";
import { RouterLink } from "../RouterLink";
import { getSiteMapNodeCaption, ISiteMapNode } from "../SiteMap/ISiteMapNode";
import { ISiteMapStore, ISiteMapStoreState } from "../SiteMap/SiteMapStore";

/**
 * Props for { @see SideBar }.
 */
export interface ISideBarProps extends IPageContextProps
{
    /**
     * CSS Class name to apply to the SideBar (default: SideBar).
     * For the items in the SideBar the class name is composed of this classname and "item",
     * e.g. "SideBar-item".
     * The active item gets, in addition to the item class name, the class name "active", e.g.
     * "SideBar-item active"
     */
    className?: string;

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
export class SideBar extends React.Component<ISideBarProps, ISideBarState>
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
        const className = this.props.className ? this.props.className : "SideBar";
        const renderNode = this.props.renderNode
                                ? this.props.renderNode
                                : (sn: ISiteMapNode, depth: number) =>
                                {
                                    const snClassName = `${className}-item`;
                                    // if (isLastItem)
                                    // {
                                    //     snClassName += " active";
                                    // }

                                    const caption = getSiteMapNodeCaption(sn, this.props.routeParameters);

                                    return <li className={snClassName} key={sn.routeExpression}>
                                        <RouterLink caption={caption} path={sn.absoluteRouteExpression} />
                                    </li>;
                                };

        return <nav aria-label="SideBar">
            <ol className={className}>
            {
                this.state.siteMap &&
                flattenSiteMap(this.state.siteMap).map(node => renderNode(node, 0))
            }
            {
                !this.state.siteMap &&
                "Not site map given"
            }
            </ol>
        </nav>;
    }
}

function flattenSiteMap(siteMap: ISiteMapNode): ISiteMapNode[]
{
    let nodeList = [siteMap];

    if (siteMap.children && siteMap.children.length > 0) {
        for (const child of siteMap.children)
        {
            nodeList = [...nodeList, ...flattenSiteMap(child)];
        }
    }

    return nodeList;
}

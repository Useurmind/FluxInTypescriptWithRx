import * as React from "react";
import { StoreSubscription } from "rfluxx";
import { Subscription } from "rxjs/Subscription";

import { RouteParameters } from "./Routing/RouterStore";
import { ISiteMapNode } from "./SiteMap/ISiteMapNode";
import { SiteMapNode } from "./SiteMap/SiteMapNode";
import { ISiteMapStore, ISiteMapStoreState } from "./SiteMap/SiteMapStore";

/**
 * Props for { @see CurrentSiteMapNode }.
 */
export interface ICurrentSiteMapNodeProps
{
    /**
     * The site map store that states the currently active site map node.
     */
    siteMapStore: ISiteMapStore;
}

/**
 * State for { @see CurrentSiteMapNode }.
 */
export interface ICurrentSiteMapNodeState
{
    /**
     * The site map node that should be rendered.
     */
    currentSiteMapNode: ISiteMapNode;

    /**
     * The parameters coming from the route.
     */
    routeParameters: RouteParameters;
}

/**
 * The CurrentSiteMapNode renders site map node that is active according to the site map store.
 */
export class CurrentSiteMapNode extends React.Component<ICurrentSiteMapNodeProps, ICurrentSiteMapNodeState>
{
    private subscription: StoreSubscription<ISiteMapStore, ISiteMapStoreState> = new StoreSubscription();

    constructor(props: ICurrentSiteMapNodeProps)
    {
        super(props);

        this.state = {
            currentSiteMapNode: null,
            routeParameters: new Map()
        };
    }

    /**
     * @inheritDoc
     */
    public componentDidMount()
    {
        this.subscription.subscribeStore(
            this.props.siteMapStore,
            x => this.setState({
                ...this.state,
                currentSiteMapNode:  x.siteMapNodeHit ? x.siteMapNodeHit.siteMapNode : null,
                routeParameters: x.siteMapNodeHit ? x.siteMapNodeHit.parameters : new Map()
            }));
    }

    /**
     * @inheritDoc
     */
    public componentWillUnmount()
    {
        if (this.subscription)
        {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    /**
     * @inheritDoc
     */
    public render(): any
    {
        if (this.state.currentSiteMapNode === null)
        {
            return <div>No site map node active</div>;
        }

        return <SiteMapNode siteMapNode={this.state.currentSiteMapNode}
                            routeParameters={this.state.routeParameters} />;
    }
}

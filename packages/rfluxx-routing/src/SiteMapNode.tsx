import * as React from "react";
import * as Rx from "rxjs";

import { ISiteMapNode } from "./SiteMapStore";

/**
 * Props for { @see SiteMapNode }.
 */
export interface ISiteMapNodeProps
{
    /**
     * The site map node that should be rendered.
     */
    siteMapNode: ISiteMapNode;

    /**
     * The parameters from the route.
     */
    routeParameters: Map<string, string>;
}

/**
 * State for { @see SiteMapNode }.
 */
export interface ISiteMapNodeState
{
}

/**
 * Component that renders a fixed site map node.
 */
export class SiteMapNode extends React.Component<ISiteMapNodeProps, ISiteMapNodeState>
{
    private subscription: Rx.Subscription;

    constructor(props: ISiteMapNodeProps)
    {
        super(props);
    }

    /**
     * @inheritDoc
     */
    public render(): any
    {
        return this.props.siteMapNode.render(this.props.routeParameters);
    }
}

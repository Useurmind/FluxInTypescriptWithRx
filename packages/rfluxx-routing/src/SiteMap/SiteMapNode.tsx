import * as React from "react";
import { Subscription } from "rxjs/Subscription";

import { withPageContext } from "../PageContextProvider";
import { RouteParameters } from "../Routing/RouterStore";

import { ISiteMapNode } from "./ISiteMapNode";

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
    routeParameters: RouteParameters;
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
    private subscription: Subscription;

    constructor(props: ISiteMapNodeProps)
    {
        super(props);
    }

    /**
     * @inheritDoc
     */
    public render(): any
    {
        return withPageContext(this.props.siteMapNode.render(this.props.routeParameters));
    }
}

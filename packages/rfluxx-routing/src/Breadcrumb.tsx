import * as React from "react";
import { Subscription } from "rxjs/Subscription";

import { RouterLink } from "./RouterLink";
import { ISiteMapNode } from "./SiteMap/ISiteMapNode";
import { ISiteMapStore } from "./SiteMap/SiteMapStore";

/**
 * Props for { @see Breadcrumb }.
 */
export interface IBreadcrumbProps
{
    /**
     * CSS Class name to apply to the breadcrumb (default: breadcrumb).
     */
    className?: string;

    /**
     * The site map store that states the currently active site map node.
     */
    siteMapStore: ISiteMapStore;

    /**
     * Render one node of the breadcrumb. By default renders a bootstrap nav entry.
     */
    renderPart?: (node: ISiteMapNode, isLastItem: boolean) => any;
}

/**
 * State for { @see Breadcrumb }.
 */
export interface IBreadcrumbState
{
    /**
     * The path of site map nodes that leads to the currently active site map node (including it).
     */
    siteMapPath: ISiteMapNode[];
}

/**
 * The breadcrumb renders the path to the currently active site map node.
 */
export class Breadcrumb extends React.Component<IBreadcrumbProps, IBreadcrumbState>
{
    private subscription: Subscription;

    constructor(props: IBreadcrumbProps)
    {
        super(props);

        this.state = {
            siteMapPath: []
        };
    }

    /**
     * @inheritDoc
     */
    public componentDidMount()
    {
        this.subscription = this.props.siteMapStore.subscribe(
            x => this.setState({
                ...this.state,
                siteMapPath:  x.siteMapNodeHit ? x.siteMapNodeHit.siteMapPath : []}));
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
        const className = this.props.className ? this.props.className : "breadcrumb";
        const renderPart = this.props.renderPart
                                ? this.props.renderPart
                                : (sn: ISiteMapNode, isLastItem: boolean) =>
                                {
                                    let snClassName = "breadcrumb-item";
                                    if (isLastItem)
                                    {
                                        snClassName += " active";
                                    }
                                    return <li className={snClassName} key={sn.routeExpression}>
                                        <RouterLink caption={sn.caption} path={sn.absoluteRouteExpression} />
                                    </li>;
                                };

        return <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
            {
                this.state.siteMapPath.length > 0 &&
                this.state.siteMapPath.map((sn, index) => renderPart(sn, index === (this.state.siteMapPath.length - 1)))
            }
            {
                this.state.siteMapPath.length === 0 &&
                "404: not found"
            }
            </ol>
        </nav>;
    }
}

import * as React from "react";
import * as Rx from "rxjs";

import { ISiteMapNode, ISiteMapStore } from "./SiteMapStore";

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
     * Render one node of the breadcrumb. By default it renders a div prepended with a >.
     */
    renderPart?: (node: ISiteMapNode) => any;
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
    private subscription: Rx.Subscription;

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
                                : (sn: ISiteMapNode) => <div>> {sn.caption}</div>;

        return <div className={className}>
            {
                this.state.siteMapPath.map(renderPart)
            }
        </div>;
    }
}

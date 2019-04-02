import * as React from "react";
import { StoreSubscription } from "rfluxx";
import { Subscription } from "rxjs/Subscription";

import { IPageContextProps } from "./PageContextProvider";
import { RouterLink } from "./RouterLink";
import { getSiteMapNodeCaption, ISiteMapNode } from "./SiteMap/ISiteMapNode";
import { ISiteMapStore, ISiteMapStoreState } from "./SiteMap/SiteMapStore";

/**
 * Props for { @see Breadcrumb }.
 */
export interface IBreadcrumbProps extends IPageContextProps
{
    /**
     * CSS Class name to apply to the breadcrumb (default: breadcrumb).
     * For the items in the breadcrumb the class name is composed of this classname and "item",
     * e.g. "breadcrumb-item".
     * The active item gets, in addition to the item class name, the class name "active", e.g.
     * "breadcrumb-item active"
     */
    className?: string;

    /**
     * The site map store that states the currently active site map node.
     * If the site map store is not given the breadcrumb will try to retrieve it from the container.
     */
    siteMapStore?: ISiteMapStore;

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
    private subscription: StoreSubscription<ISiteMapStore, ISiteMapStoreState>
        = new StoreSubscription();

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
        const store = this.props.siteMapStore
                        ? this.props.siteMapStore
                        : this.props.container.resolve<ISiteMapStore>("ISiteMapStore");

        if (!store)
        {
            throw Error("The site map store in the breadcrumb was neither given through the props"
                        + " nor was a container passed to the props.");
        }

        this.subscription.subscribeStore(
            store,
            x => this.setState({
                ...this.state,
                siteMapPath:  x.siteMapNodeHit ? x.siteMapNodeHit.siteMapPath : []}));
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
        const className = this.props.className ? this.props.className : "breadcrumb";
        const renderPart = this.props.renderPart
                                ? this.props.renderPart
                                : (sn: ISiteMapNode, isLastItem: boolean) =>
                                {
                                    let snClassName = `${className}-item`;
                                    if (isLastItem)
                                    {
                                        snClassName += " active";
                                    }

                                    const caption = getSiteMapNodeCaption(sn, this.props.container);

                                    return <li className={snClassName} key={sn.routeExpression}>
                                        <RouterLink caption={caption} path={sn.absoluteRouteExpression} />
                                    </li>;
                                };

        return <nav aria-label="breadcrumb">
            <ol className={className}>
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

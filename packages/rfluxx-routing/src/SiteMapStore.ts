import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";

import { IRoute, IRouteHit, IRouterStoreState } from "./RouterStore";

/**
 * Interface describing the site map node that was hit.
 */
export interface ISiteMapNodeHit
{
    /**
     * The site map node that was hit.
     */
    siteMapNode: ISiteMapNode;

    /**
     * The url that lead to the site map node being hit.
     */
    url: URL;

    /**
     * The paramaters of the route that lead to the hit of the node.
     */
    parameters: Map<string, string>;

    /**
     * An array of site map nodes that reflect the path from the root node to
     * the site map node that was hit (including it).
     */
    siteMapPath: ISiteMapNode[];
}

/**
 * A single site map node.
 */
export interface ISiteMapNode
{
    /**
     * The caption of the site map node.
     */
    caption: string;

    /**
     * The route that should be matched by the site map node.
     * Can be
     * - relative to parent (without leading slash), e.g. partial/path/to/route1
     * - absolute (with leading slash), e.g. /complete/path/to/route1
     */
    routeExpression: string;

    /**
     * DONT SET THIS.
     * The absolute route expression is calculated from
     * the routeExpression and the hierarchie of the
     * site map nodes.
     * Relative paths are prefixed with the absolute route
     * expression of their parents.
     */
    absoluteRouteExpression?: string;

    /**
     * The child site map nodes of this node.
     */
    children?: ISiteMapNode[];

    /**
     * Render the site map node.
     * Takes the parameter values of the route.
     */
    render: (parameters: Map<string, string>) => any;
}

/**
 * Constructor options for the { @see SiteMapStore }.
 */
export interface ISiteMapStoreOptions extends IInjectedStoreOptions {
    /**
     * The root node of the site map.
     */
    siteMap: ISiteMapNode;

    /**
     * The router store from which to retrieve the
     */
    routerStore: IStore<IRouterStoreState>;
}

/**
 * State for the { @see SiteMapStore }.
 */
export interface ISiteMapStoreState
{
    /**
     * Describes which site map node was hit.
     */
    siteMapNodeHit: ISiteMapNodeHit;
}

/**
 * Interface for interacting with the window management store.
 */
export interface ISiteMapStore extends IStore<ISiteMapStoreState> {

}

/**
 * This store is responsible for keeping track of all open windows and opening, switching,
 * eand closing windows.
 */
export class SiteMapStore extends Store<ISiteMapStoreState> implements ISiteMapStore {
    /**
     * Contains all site map nodes keyed by route expression.
     * As multiple site map nodes can share a route expression the value is a list of nodes.
     * We still have to check each node in the list for matching parameters.
     */
    private siteMapNodeMap = new Map<string, ISiteMapNode[]>();

    /**
     * This map stores the full path of site map nodes to a site map node.
     */
    private siteMapNodePathMap = new Map<ISiteMapNode, ISiteMapNode[]>();

    /**
     * Compute the site map node that was hit by the currently hit route.
     */
    private deriveSiteMapNodeFromRoute: IAction<IRouteHit>;

    /**
     * Create a new instance.
     */
    constructor(private options: ISiteMapStoreOptions)
    {
        super({
            initialState: {
                siteMapNodeHit: null
            }
        });

        // add all site map nodes to a map
        forEachSiteMapNode(this.options.siteMap, (sn, snPath) =>
        {
            sn.absoluteRouteExpression = sn.absoluteRouteExpression.toLowerCase();

            this.siteMapNodePathMap.set(sn, snPath);

            if (this.siteMapNodeMap.has(sn.absoluteRouteExpression))
            {
                const snList = this.siteMapNodeMap.get(sn.absoluteRouteExpression);
                snList.push(sn);
            }
            else
            {
                const snList = [sn];
                this.siteMapNodeMap.set(sn.absoluteRouteExpression, snList);
            }
        });

        this.deriveSiteMapNodeFromRoute = this.createActionAndSubscribe(x => this.deriveSiteMapNodeFromRouteImpl(x));

        this.options.routerStore.subscribe(s =>
        {
            this.deriveSiteMapNodeFromRoute.trigger(s.currentHit);
        });
    }

    private deriveSiteMapNodeFromRouteImpl(routeHit: IRouteHit): void
    {
        if (!routeHit)
        {
            this.setState({
                ...this.state,
                siteMapNodeHit: null
            });
            return;
        }

        const lowerHitExpression = routeHit.route.expression.toLowerCase();

        if (this.siteMapNodeMap.has(lowerHitExpression))
        {
            const nodeList = this.siteMapNodeMap.get(lowerHitExpression);

            for (const node of nodeList)
            {
                // we take the first node that matches the expression of the route
                // we do this because we use the expression as a unique identifier
                // for the route

                const siteMapNodeHit: ISiteMapNodeHit = {
                    parameters: routeHit.parameters,
                    siteMapNode: node,
                    url: routeHit.url,
                    siteMapPath: this.siteMapNodePathMap.get(node)                    };

                this.setState({ siteMapNodeHit });
                return;
            }
        }
        else
        {
            this.setState({ siteMapNodeHit: null });
        }
    }
}

/**
 * Execute an action for each site map node in the tree of nodes.
 * @param root The root node.
 * @param action An action to execute for each node.
 * @param path The path of site map nodes until before the current root node (excluding the root node).
 */
function forEachSiteMapNode<T>(
    root: ISiteMapNode,
    action: (s: ISiteMapNode, sPath: ISiteMapNode[], parentValue?: T) => void | T,
    path: ISiteMapNode[] = [],
    parentValue?: T): void
{
    const newPath = path.concat([root]);

    const rootValue = action(root, newPath, parentValue);

    if (root.children === undefined)
    {
        return;
    }

    for (const node of root.children)
    {
        forEachSiteMapNode(node, action, newPath, rootValue);
    }
}

/**
 * Get a list of routes for the site map in the correct order.
 * AND set the absolute route expressions on all site map nodes.
 * We deduplicate the routes by expression and sort them from highest to lowest length.
 * @param root The root node of the site map.
 */
export function computeSiteMapRoutesAndSetAbsoluteRouteExpressions(root: ISiteMapNode): IRoute[]
{
    const routeExpressions: string[] = [];

    forEachSiteMapNode(
        root,
        (sn, snPath, parentValue: string) =>
        {
            const absoluteRouteExpression: string = getAbsoluteRouteExpression(sn, parentValue);

            sn.absoluteRouteExpression = absoluteRouteExpression;
            routeExpressions.push(absoluteRouteExpression);

            return absoluteRouteExpression;
        });

    const uniqueRouteExpressions = new Set(routeExpressions);

    return Array.from(uniqueRouteExpressions)
    .sort((a, b) => b.length - a.length)
    .map(e =>
    {
        const route: IRoute = {
            expression: e
        };

        return route;
    });
}

/**
 * Compute the absolute route expression of a site map node with its parent expression.
 * @param siteMapNode The site map node for which to compute the absolute route expression.
 * @param parentExpression The absolute route expression of the site map nodes parent.
 */
function getAbsoluteRouteExpression(siteMapNode: ISiteMapNode, parentExpression?: string): string
{
    const routeIsAbsolute = siteMapNode.routeExpression.startsWith("/");
    const expression = siteMapNode.routeExpression;

    if (!parentExpression)
    {
        // the url of the root node must be absolute
        return routeIsAbsolute ? expression : "/" + expression;
    }

    if (routeIsAbsolute)
    {
        return expression;
    }

    return parentExpression.replace(/\/*$/, "") + "/" + expression;
}

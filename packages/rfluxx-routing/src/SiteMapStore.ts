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
     */
    route: IRoute;

    /**
     * A function that checks the parameters of the route.
     * Only if this field is null or returns true in addition to the route match
     * the site map node is a match for the selected route.
     */
    matchParameters?: (parameters: Map<string, string>) => boolean;

    /**
     * The child site map nodes of this node.
     */
    children?: ISiteMapNode[];
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
            sn.route.expression = sn.route.expression.toLowerCase();

            this.siteMapNodePathMap.set(sn, snPath);

            if (this.siteMapNodeMap.has(sn.route.expression))
            {
                const snList = this.siteMapNodeMap.get(sn.route.expression);
                snList.push(sn);
            }
            else
            {
                const snList = [sn];
                this.siteMapNodeMap.set(sn.route.expression, snList);
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
            return;
        }

        const lowerHitExpression = routeHit.route.expression.toLowerCase();

        if (this.siteMapNodeMap.has(lowerHitExpression))
        {
            const nodeList = this.siteMapNodeMap.get(lowerHitExpression);

            for (const node of nodeList)
            {
                if (node.matchParameters === undefined || node.matchParameters(routeHit.parameters))
                {
                    const siteMapNodeHit: ISiteMapNodeHit = {
                        parameters: routeHit.parameters,
                        siteMapNode: node,
                        siteMapPath: this.siteMapNodePathMap.get(node)                    };

                    this.setState({ siteMapNodeHit });
                    return;
                }
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
function forEachSiteMapNode(
    root: ISiteMapNode,
    action: (s: ISiteMapNode, sPath: ISiteMapNode[]) => void,
    path: ISiteMapNode[] = []): void
{
    const newPath = path.concat([root]);

    action(root, newPath);

    if (root.children === undefined)
    {
        return;
    }

    for (const node of root.children)
    {
        forEachSiteMapNode(node, action, newPath);
    }
}

/**
 * Get a list of routes for the site map in the correct order.
 * We deduplicate the routes by expression and sort them from highest to lowest length.
 * @param root The root node of the site map.
 */
export function getSiteMapRoutes(root: ISiteMapNode): IRoute[]
{
    const routeExpressions: string[] = [];

    forEachSiteMapNode(root, sn => routeExpressions.push(sn.route.expression.toLowerCase()));

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

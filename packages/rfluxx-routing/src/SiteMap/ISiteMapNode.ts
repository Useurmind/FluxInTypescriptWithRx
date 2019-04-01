import { IPageContainerFactory } from "../DependencyInjection/IPageContainerFactory";

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
     * This is a factory that creates a container specific for this page (optional).
     * When no container factory is specified in the site map node it will use the
     * central container factory.
     * Specifying one container per page will split their registrations
     * properly and reduce interference between different pages.
     */
    containerFactory?: IPageContainerFactory;

    /**
     * Render the site map node.
     * Takes the parameter values of the route.
     */
    render: (parameters: Map<string, string>) => any;
}

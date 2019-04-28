import * as React from "react";
import { IContainer } from "rfluxx";

import { IPageContainerFactory } from "../DependencyInjection/IPageContainerFactory";
import { IPageContextProps, withPageContext } from "../PageContextProvider";
import { RouteParameters } from "../RouterStore";

/**
 * Type used for anything that should render a component in a page, e.g. the caption or sitemapnode itself.
 */
export type IRenderPageComponent = (props: RouteParameters) => React.ReactElement<any>;

/**
 * A single site map node.
 */
export interface ISiteMapNode
{
    /**
     * The caption of the site map node.
     */
    caption: string | IRenderPageComponent;

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
    render: IRenderPageComponent;

    /**
     * Should the site map node be shown in the sidebar.
     * Default is true.
     * If this value is a string it is the path to use for the site map node.
     * If this value is a map it tells the parameters to use for the url
     * in the sidebar.
     */
    showInSidebar?: boolean | string | Map<string, string>;
}

/**
 * Compute the caption of a site map node.
 * @param siteMapNode The site map node to compute the caption for.
 * @param container The container that holds the page context.
 * @returns If the caption of the site map node is not a string and no container is given an error is thrown.
 *          Else a component or string is returned.
 */
export function getSiteMapNodeCaption(siteMapNode: ISiteMapNode, routeParameters: RouteParameters | null)
    : string | React.ReactNode
{
    if (typeof(siteMapNode.caption) === "string")
    {
        return siteMapNode.caption as string;
    }
    else
    {
        if (!routeParameters)
        {
            throw Error("When using a component for site map node captions, you must place the breadcrumb"
             + " inside the page component of the site map node. Use a master component for all pages to "
             + ` implement a shared layout (site map node ${siteMapNode.routeExpression}).`);
        }

        return withPageContext(siteMapNode.caption(routeParameters));
    }
}

/**
 * Tells you whether a site map node should be rendered in the side bar based
 * on the value of "showInSidebar" prop.
 * @param siteMapNode The site map node.
 */
export function shouldSiteMapNodeRenderInSideBar(siteMapNode: ISiteMapNode): boolean
{
    return siteMapNode.showInSidebar !== false;
}

/**
 * Get the url that should be used for the site map node in the sidebar.
 * @param siteMapNode The sitemap node.
 */
export function getSiteMapNodeSideBarUrl(siteMapNode: ISiteMapNode): string
{
    if (typeof siteMapNode.showInSidebar === "string")
    {
        return siteMapNode.showInSidebar;
    }

    if (typeof siteMapNode.showInSidebar === "object")
    {
        // its a map
        const parameterMap = siteMapNode.showInSidebar as Map<string, string>;
        let path = siteMapNode.absoluteRouteExpression.toLowerCase();

        for (const key of parameterMap.keys())
        {
            const value = parameterMap.get(key);
            const lowerKey = key.toLowerCase();

            // replace
            // - path parameter
            // - search parameter
            // - NOT: hash parameters (as these can be anything)
            // see route_parameters.md
            path = path.replace(`\{${lowerKey}\}`, value)
                       .replace(`${lowerKey}={*}`, `${key}=${value}`);
        }

        return path;
    }

    return siteMapNode.absoluteRouteExpression;
}

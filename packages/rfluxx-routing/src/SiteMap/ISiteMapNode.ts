import * as React from "react";
import { IContainer } from "rfluxx";

import { IPageContainerFactory } from "../DependencyInjection/IPageContainerFactory";
import { IPageContextProps } from "../PageContextProvider";

/**
 * Props for a component that renders the caption of a site map node.
 */
export interface ISiteMapNodeCaptionProps extends IPageContextProps
{

}

export type IRenderCaption = (props: ISiteMapNodeCaptionProps) => React.ReactNode;

/**
 * A single site map node.
 */
export interface ISiteMapNode
{
    /**
     * The caption of the site map node.
     */
    caption: string | IRenderCaption;

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

/**
 * Compute the caption of a site map node.
 * @param siteMapNode The site map node to compute the caption for.
 * @param container The container that holds the page context.
 * @returns If the caption of the site map node is not a string and no container is given an error is thrown.
 *          Else a component or string is returned.
 */
export function getSiteMapNodeCaption(siteMapNode: ISiteMapNode, container: IContainer | null)
    : string | React.ReactNode
{
    if (typeof(siteMapNode.caption) === "string")
    {
        return siteMapNode.caption as string;
    }
    else
    {
        if (!container)
        {
            throw Error("When using a component for site map node captions, you must place the breadcrumb"
             + " inside the page component of the site map node. Use a master component for all pages to "
             + ` implement a shared layout (site map node ${siteMapNode.routeExpression}).`);
        }

        if (typeof(siteMapNode.caption) === "function")
        {
            return siteMapNode.caption({ container });
        }
        else
        {
            return React.createElement(siteMapNode.caption as any, { container });
        }
    }
}

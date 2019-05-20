import { IContainer, ICreationRule } from "rfluxx";

import { ISiteMapNode } from "../SiteMap/ISiteMapNode";

import { IGlobalContainerRegistration } from "./IGlobalContainerRegistration";
import { ISiteMapNodeContainerRegistration } from "./ISiteMapNodeContainerRegistration";

/**
 * Interface for a page aware container builder.
 * There is only one for the whole app.
 */
export interface IPageAwareContainerBuilder
{
    /**
     * This function is meant for usage by the global container factory.
     * The registrations are available in all pages although the instances are
     * not always shared between the pages.
     */
    registerGlobally(create: ICreationRule): IGlobalContainerRegistration;

    /**
     * This function is meant for usage by the site map node container factory.
     * The registrations are available only in the pages of the given sitemap node
     * although the instances are not shared between the pages.
     * @param siteMapNode The site map node to register a creation rule for.
     * @param create The creation rule.
     */
    registerLocally(siteMapNode: ISiteMapNode, create: ICreationRule): ISiteMapNodeContainerRegistration;

    /**
     * Create a container for a global context.
     * Per container created non shared instances will be different.
     */
    createGlobalContainer(): IContainer;

    /**
     * Create a container for the given site map node.
     * @param siteMapNode The site map node for which to create a container.
     */
    createContainer(siteMapNode: ISiteMapNode): IContainer;

    /**
     * Derive a clone from this builder that already contains all registrations
     * but can be extended independent of the original builder.
     */
    derive(): IPageAwareContainerBuilder;
}

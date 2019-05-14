import { IPageRequest } from "../PageCommunication";
import { RouteParameters } from "../Routing/RouterStore";

import { ISiteMapNodeContainerBuilder } from "./SiteMapNodeContainerBuilder";

/**
 * This type of container factory is used to register services for a container of a site map node.
 * You need to provide an implementation for this so that you can register your services
 * for inclusion into the container of your site map node.
 */
export interface ISiteMapNodeContainerFactory
{
    /**
     * Register necessary services for a site map node in the app container.
     * The container should contain the following registrations:
     * - IPageStore: The store that can be used by the page to get easy access to central services.
     * - IPageRequest: The request that lead to the page opening, optional can be null|undefined.
     * - PageUrl: The url (of type URL) that was called for the page to open.
     * - RouteParameters: The parameters (of type RouteParameters) that were retrieved from the routes url.
     * @param builder The builder in which the registration of services should be performed.
     */
    register(builder: ISiteMapNodeContainerBuilder): void;
}

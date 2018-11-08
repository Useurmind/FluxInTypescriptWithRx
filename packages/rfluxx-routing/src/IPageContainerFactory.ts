import { IContainer } from "rfluxx";

import { IPageManagementStore } from "./PageManagementStore";
import { IRouterStore } from "./RouterStore";
import { ISiteMapStore } from "./SiteMapStore";

/**
 * Data object to hold the stores that are globally unique in the
 * routing library.
 */
export interface IGlobalStores
{
    /**
     * The router store that watches the window location for changes.
     */
    routerStore: IRouterStore;

    /**
     * The site map store that determines the current site map node.
     */
    siteMapStore: ISiteMapStore;

    /**
     * The page management store that manages the state for the active pages.
     */
    pageManagementStore: IPageManagementStore;
}

/**
 * The container factory is used to create a container for a page.
 * You need to provide an implementation for this so that the { @see PageManagementStore}
 * can create a new container for each new page it hits.
 */
export interface IPageContainerFactory
{
    /**
     * Create a new container.
     * @param urlFragment The url fragment of the page for which the container is created.
     * @param routeParamters The parameters that were extracted from the route.
     * @param globalStores The global stores provided by the framework.
     * @returns The new container.
     */
    createContainer(urlFragment: string, routeParameters: Map<string, string>, globalStores: IGlobalStores): IContainer;
}

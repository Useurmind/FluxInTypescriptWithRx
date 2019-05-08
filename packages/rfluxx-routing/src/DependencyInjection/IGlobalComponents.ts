import { IPageCommunicationStore } from "../PageCommunication";
import { IPageManagementStore } from "../PageManagementStore";
import { IRouterStore } from "../Routing/RouterStore";
import { ISiteMapStore } from "../SiteMap/SiteMapStore";

/**
 * Data object to hold the stores that are globally unique in the
 * routing library.
 */
export interface IGlobalComponents
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

    /**
     * The store that allows for communication between pages.
     */
    pageCommunicationStore: IPageCommunicationStore;
}

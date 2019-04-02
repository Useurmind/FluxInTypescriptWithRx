import * as Rfluxx from "rfluxx";

import { IPageRequest } from "../PageCommunication";
import { RouteParameters } from "../RouterStore";
import { ISiteMapNode } from "../SiteMap/ISiteMapNode";

/**
 * A page represents the UI for a single site map node.
 */
export interface IPageData
{
    /**
     * The id of the page according to the page id algorithm.
     */
    pageId: string;

    /**
     * The site map node implemented by this page.
     */
    siteMapNode: ISiteMapNode;

    /**
     * The container managing the stores for the page.
     */
    container: Rfluxx.IContainer;

    /**
     * The url of the page.
     */
    url: URL;

    /**
     * Is the page currently being edited.
     * Editing blocks eviction of the page state.
     */
    isInEditMode: boolean;

    /**
     * The route parameters extracted from the url fragment.
     */
    routeParameters: RouteParameters;

    /**
     * The request that lead to the page being opened.
     * Pages can (and if possible should) be opened without a page request.
     * In case of inter page communication page request are necesarry as the
     * input mechanism for the calling page.
     */
    pageRequest: IPageRequest | null;

    /**
     * A set of page requests that were created by this page.
     * The key of the requests is the target page id (the id of the requested page).
     * This tracks the pages that were opened through communication by this page.
     * It can influence how state is evicted.
     */
    openRequests: Map<string, IPageRequest>;
}

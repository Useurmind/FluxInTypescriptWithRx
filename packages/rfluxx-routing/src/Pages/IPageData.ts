import * as Rfluxx from "rfluxx";

import { IPageRequest } from "../PageCommunicationStore";
import { ISiteMapNode } from "../SiteMapStore";

/**
 * A page represents the UI for a single site map node.
 */
export interface IPageData
{
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
    routeParameters: Map<string, string>;

    /**
     * The request that lead to the page being opened.
     * Pages can (and if possible should) be opened without a page request.
     * In case of inter page communication page request are necesarry as the
     * input mechanism for the calling page.
     */
    pageRequest: IPageRequest | null;
}

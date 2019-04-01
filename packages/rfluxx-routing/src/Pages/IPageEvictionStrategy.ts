import { ISiteMapNodeHit } from "../SiteMap/SiteMapStore";

import { IPageData } from "./IPageData";

/**
 * Interface to implement different page eviction strategies.
 */
export interface IPageEvictionStrategy
{
    /**
     * Used to inform this implementation that a page was closed.
     * Can be used to update bookkeeping information.
     * @param pageId The page id of the page that was closed.
     */
    onPageClosed(pageId: string): void;

    /**
     * Compute the necessary page state evicitions when a new site map node is hit.
     * @param siteMapNodeHit The site map node hit that just happened.
     * @param pageMap The map with the data of all pages keyed by their page id.
     * @returns An array of page ids that should be evicted.
     */
    getEvictionsOnSiteMapNodeHit(siteMapNodeHit: ISiteMapNodeHit, pageMap: Map<string, IPageData>): string[];
}

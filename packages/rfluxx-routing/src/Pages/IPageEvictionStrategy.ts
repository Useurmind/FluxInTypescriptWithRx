import { IPage } from "../PageManagementStore";
import { ISiteMapNodeHit } from "../SiteMapStore";

/**
 * Interface to implement different page eviction strategies.
 */
export interface IPageEvictionStrategy
{
    /**
     * Compute the necessary page state evicitions when a new site map node is hit.
     * @param siteMapNodeHit The site map node hit that just happened.
     * @param pageMap The map with the state of all pages keyed by their page id.
     * @returns An array of page ids that should be evicted.
     */
    getEvictionsOnSiteMapNodeHit(siteMapNodeHit: ISiteMapNodeHit, pageMap: Map<string, IPage>): string[];
}

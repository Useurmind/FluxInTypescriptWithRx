import { IPage } from "../PageManagementStore";
import { ISiteMapNodeHit } from "../SiteMapStore";

import { IPageEvictionStrategy } from "./IPageEvictionStrategy";

/**
 * This strategy evicts the state of the pages that weren't used recently.
 * There are however some special attributes that need to be taken into account.
 * When a page has
 * - `isInEditMode` set to true
 * - or `pageRequest` set
 * When a page is in edit mode we should not just throw away the edited content
 * 
 * not just throw away its state, it should not be evicted in the natural page state eviction.
 */
export class LruPageStateEvictions implements IPageEvictionStrategy
{
    /**
     * @inheritDoc
     */
    public getEvictionsOnSiteMapNodeHit(siteMapNodeHit: ISiteMapNodeHit, pageMap: Map<string, IPage>): string[]
    {
        return [];
    }
}

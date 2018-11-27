import { IPage } from "../PageManagementStore";
import { ISiteMapNodeHit } from "../SiteMapStore";

import { IPageEvictionStrategy } from "./IPageEvictionStrategy";

/**
 * This basic strategy leads to no page state evictions at all.
 */
export class NoPageStateEvictions implements IPageEvictionStrategy
{
    /**
     * @inheritDoc
     */
    public getEvictionsOnSiteMapNodeHit(siteMapNodeHit: ISiteMapNodeHit, pageMap: Map<string, IPage>): string[]
    {
        return [];
    }
}

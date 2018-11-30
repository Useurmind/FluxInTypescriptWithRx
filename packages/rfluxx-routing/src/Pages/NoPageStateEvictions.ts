import { ISiteMapNodeHit } from "../SiteMapStore";

import { IPageData } from "./IPageData";
import { IPageEvictionStrategy } from "./IPageEvictionStrategy";

/**
 * This basic strategy leads to no page state evictions at all.
 */
export class NoPageStateEvictions implements IPageEvictionStrategy
{
    /**
     * @inheritDoc
     */
    public onPageClosed(pageId: string): void
    // tslint:disable-next-line:no-empty
    {

    }

    /**
     * @inheritDoc
     */
    public getEvictionsOnSiteMapNodeHit(siteMapNodeHit: ISiteMapNodeHit, pageMap: Map<string, IPageData>): string[]
    {
        return [];
    }
}

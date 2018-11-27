import { IPageIdAlgorithm } from "./IPageIdAlgorithm";

/**
 * This page id algorithm only uses the path and search as the page id.
 * Page id is computed as `url.pathname + url.search`.
 */
export class PathAndSearchPageId implements IPageIdAlgorithm
{
    /**
     * @inheritDoc
     */
    public getPageId(url: URL): string
    {
        // use pathname and search as key for a page
        // the hash can be used for intra page navigation
        return url.pathname + url.search;
    }
}

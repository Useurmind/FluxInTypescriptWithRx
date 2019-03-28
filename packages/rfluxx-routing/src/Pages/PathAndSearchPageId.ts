import { IPageIdAlgorithm } from "./IPageIdAlgorithm";

/**
 * Options for { @see PathAndSearchPageId }.
 */
export interface IPathAndSearchPageIdOptions
{
    /**
     * Ignore one or several parameters for the page id computation.
     */
    ignoredParameters: string[];
}

/**
 * This page id algorithm only uses the path and search as the page id.
 * Page id is computed as `url.pathname + url.search`.
 */
export class PathAndSearchPageId implements IPageIdAlgorithm
{
    constructor(private options?: IPathAndSearchPageIdOptions)
    {
        if (!options)
        {
            this.options = {
                ignoredParameters: []
            };
        }

        if (!this.options.ignoredParameters)
        {
            this.options.ignoredParameters = [];
        }
    }

    /**
     * @inheritDoc
     */
    public getPageId(url: URL): string
    {
        // we need to sort the url params to get a unique page id for the same set of parameters
        const paramsKeys: string[] = Array.from(url.searchParams.keys()) as string[];

        const sortedAndFilteredKeys = paramsKeys.filter(x =>
                                                    this.options.ignoredParameters.findIndex(y => y === x) === -1)
                                                .sort();

        const sortedSearchString = sortedAndFilteredKeys.map(x => `${x.toLowerCase()}=${url.searchParams.get(x)}`)
                                                        .join("&");

        // use pathname and search as key for a page
        // the hash can be used for intra page navigation
        return url.pathname.toLowerCase() + (sortedSearchString ? "?" + sortedSearchString : "");
    }
}

/**
 * Interface for different algorithms to implement the computation of a page id.
 */
export interface IPageIdAlgorithm
{
    /**
     * Return the id of the page for the given url.
     * @param url The url for which the page id should be computed.
     */
    getPageId(url: URL): string;
}

/**
 * Interface for requesting to open a page.
 */
export interface IPageRequest
{
    /**
     * The url of the page that poses the request.
     */
    origin: URL;

    /**
     * The url of the page to request.
     */
    target: URL;

    /**
     * Data that should be handed to the requested page.
     * Both requesting page and responding page must be aware
     * of the correct data transported here.
     */
    data: any | null;
}

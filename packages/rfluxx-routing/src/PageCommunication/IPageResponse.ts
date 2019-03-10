import { IPageRequest } from "./IPageRequest";
import { PageResultStatus } from "./PageResultStatus";

/**
 * Interface for a response of a page request.
 */
export interface IPageResponse
{
    /**
     * The request from which the response results.
     * The request object stays the same so you can compare with ===
     * for the correct response to a request.
     */
    request: IPageRequest;

    /**
     * Data that should be handed to the requesting page after
     * the requested page was commited.
     * Both requesting page and responding page must be aware
     * of the correct data transported here.
     * The page result can be null!
     */
    data: any | null;

    /**
     * The result status of the requested page.
     */
    status: PageResultStatus;
}

import { IAction } from "rfluxx";

import { IPageRequest } from "./IPageRequest";

/**
 * Interface for a store to implement to receive a { @see IPageRequest } object when
 * created.
 */
export interface IRequestedPageStore
{
    /**
     * Called by the routing framework after the store was created.
     * Will give the page request object to the store when one is present for the current page.
     */
    setPageRequest: IAction<IPageRequest>;
}

/**
 * Check if the given object is an { @see IRequestedPageStore }.
 * @param obj The object to check.
 */
export function isIRequestedPageStore(obj: any): obj is IRequestedPageStore
{
    return obj.setPageRequest !== null && obj.setPageRequest !== undefined;
}

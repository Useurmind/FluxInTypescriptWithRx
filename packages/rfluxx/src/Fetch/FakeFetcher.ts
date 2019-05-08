
import { Observable } from "rxjs";

import { IObservableFetcher } from "./IObservableFetcher";

/**
 * Options for the fake fetcher.
 */
export interface IFakeFetcherOptions
{
    /**
     * A fixed response that is returned for each request.
     */
    fixedResponse?: Response;

    /**
     * Action that can calculate any response from the actual request.
     */
    createResponse?: (requestInfo: RequestInfo, init?: RequestInit) => Response;
}

/**
 * This fetcher does not fetch anything.
 * Instead you can inject any responses you want to be delivered.
 */
export class FakeFetcher implements IObservableFetcher
{
    private pfetches: number = 0;

    /**
     * Number of fetches performed.
     */
    public get fetches()
    {
        return this.pfetches;
    }

    constructor(private options: IFakeFetcherOptions)
    {
    }

    /**
     * @inheritDoc
     */
    public fetch(requestInfo: RequestInfo, init?: RequestInit): Observable<Response>
    {
        this.pfetches++;

        const response = this.options.fixedResponse
                            ? this.options.fixedResponse
                            : this.options.createResponse(requestInfo, init);

        return Observable.of(response);
    }
}

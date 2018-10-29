import { Observable } from 'rxjs';

/**
 * Interface for implementations of an observable fetcher.
 * This interface is necessary to make backend calls aware of replay functionality.
 * See the implementation ObservabelFetcher on how this can be implemented.
 */
export interface IObservableFetcher {
    /**
     * Fetch something with the fetch function from a server.
     * @param requestInfo The request info as usually given to the fetch function
     * @param init The request init as usually given to the fetch function.
     * @returns An observable with the response that can be subscribed.
     */
    fetch(requestInfo: RequestInfo, init?: RequestInit): Observable<Response>;
}
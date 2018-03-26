import { Observable } from 'rxjs';

/**
 * Interface for implementations of an observable fetcher.
 */
export interface IObservableFetcher {
    fetch(requestInfo: RequestInfo, init?: RequestInit): Observable<Response>;
}
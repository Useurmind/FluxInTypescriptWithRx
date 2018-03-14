import * as Rx from "rxjs/Rx";

/**
 * Interface for a store.
 */
export interface IStore<TState>
{
    /**
     * Observe the store to subscribe it afterwards with advanced options.
     * Use subscribe for less verbosity.
     * @returns {}
     */
    observe(): Rx.Observable<TState>;

    /**
     * Subscribe state changes of the store.
     * @next The subscription handler that handles changes to the state.
     * @returns The subscription to cancel the subscription.
     */
    subscribe(next: (state: TState) => void): Rx.Subscription;
}
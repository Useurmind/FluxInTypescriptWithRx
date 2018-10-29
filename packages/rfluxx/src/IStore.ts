import * as Rx from "rxjs/Rx";

import { IResetMyState } from "./IResetMyState";

/**
 * Interface for a store.
 * Stores are the core of the flux pattern and hold the state for a specific "area" of your UI.
 * The state is implemented as an observable that can be subscribed for async access to state
 * changes.
 * The good thing about observables is that advanced stuff like filter, map, and other transformations
 * are included by default.
 */
export interface IStore<TState> extends IResetMyState
{
    /**
     * Observe the store to subscribe it afterwards with advanced options.
     * Use subscribe for less verbosity.
     * @returns A full observable of the state that can be subscribed.
     */
    observe(): Rx.Observable<TState>;

    /**
     * Subscribe state changes of the store.
     * @param next The subscription handler that handles changes to the state.
     * @returns The subscription to cancel the subscription.
     */
    subscribe(next: (state: TState) => void): Rx.Subscription;
}

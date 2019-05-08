import { ISubscription, Subscription } from "rxjs/Subscription";

import { IStore } from "./IStore";

/**
 * Helper to subscribe a store and unsubscribe it.
 */
export class StoreSubscription<TStore extends IStore<TStoreState>, TStoreState>
{
    /**
     * The store that was subscribed.
     */
    public store: TStore;

    /**
     * The subscription to the store.
     */
    private subscription: Subscription;

    /**
     * Subscribe the given store.
     * If it is the same store as before nothing is done.
     * For a new store the old subscription is cancelled first.
     * @param store The store to subscribe.
     * @param nextState Handler for state changes in the given store.
     */
    public subscribeStore(
        store: TStore,
        nextState: (state: TStoreState) => void)
    {
        if (this.store === store)
        {
            // only renew the subscription when a different store is subscribed
            return;
        }

        this.unsubscribe();

        this.store = store;
        if (store)
        {
            this.subscription = store.subscribe(nextState);
        }
    }

    /**
     * Unsubscribe the current subscription if any.
     */
    public unsubscribe(): void
    {
        if (this.subscription)
        {
            this.subscription.unsubscribe();
            this.subscription = null;
            this.store = null;
        }
    }
}

import { Subscription } from "rxjs/Subscription";

import { IStore } from "rfluxx";
import { ISubscription } from "rxjs/Subscription";

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

    public unsubscribe(): void
    {
        if (this.subscription)
        {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
}

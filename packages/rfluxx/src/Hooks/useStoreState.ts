import { useEffect, useState } from "react";
import { IStore } from "../IStore";
import { StoreSubscription } from '../StoreSubscription';

/**
 * A react hook to retrieve the state from a store via subscription.
 * @param store The store to retrieve the state from.
 * @returns The state of the store.
 */
export function useStoreState<TState>(store: IStore<TState>) : TState | null
{
    const [ storeState, setStoreState ] = useState(null as (TState | null));
    const storeSubscription = new StoreSubscription<IStore<TState>, TState>();
   
    useEffect(() => {       
        storeSubscription.subscribeStore(store, setStoreState);

        return () => {
            storeSubscription.unsubscribe();
        };
    });
    
    return storeState;
}
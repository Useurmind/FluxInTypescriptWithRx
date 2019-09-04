import { Observable } from "rxjs";
import { take } from "rxjs/operators";

import { IStore } from "../IStore";

/**
 * This is a short hand for getting only the current store state.
 * The resulting observable delivers one state object and then finishes.
 * @param store The store to get the state from.
 */
export function currentStoreState<TState>(store: IStore<TState>): Observable<TState>
{
    return store.observe().pipe(take(1));
}

import { Observable } from "rxjs-compat/Observable";
import { Subscription } from "rxjs-compat/Subscription";

import { IAction } from "./IAction";

/**
 * Interface of action that can be used by stores to subscribe action event streams.
 */
export interface IObservableAction<TActionEvent> extends IAction<TActionEvent>
{
    /**
     * Convert an action into an observable to subscribe it.
     * @returns {}
     */
    observe(): Observable<TActionEvent>;

    /**
     * Subscribe to the streams of action events directly.
     * @param next
     * @returns {}
     */
    subscribe(next: (parameter: TActionEvent) => void): Subscription;
}

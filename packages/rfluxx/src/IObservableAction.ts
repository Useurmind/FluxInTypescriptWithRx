import * as Rx from "rxjs/Rx";

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
    observe(): Rx.Observable<TActionEvent>;

    /**
     * Subscribe to the streams of action events directly.
     * @param next
     * @returns {}
     */
    subscribe(next: (parameter: TActionEvent) => void): Rx.Subscription;
}

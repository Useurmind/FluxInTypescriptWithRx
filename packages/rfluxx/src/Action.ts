import * as Rx from "rxjs/Rx";

import { IAction } from "./IAction";
import { IObservableAction } from "./IObservableAction";

/**
 * Simple action class instatiated by stores.
 */
export class Action<TActionEvent> implements IObservableAction<TActionEvent>
{
    private subject: Rx.Subject<TActionEvent>;

    constructor()
    {
        this.subject = new Rx.Subject<TActionEvent>();
    }

    /**
     * {@inheritdoc }
     */
    public observe(): Rx.Observable<TActionEvent>
    {
        return this.subject;
    }

    /**
     * {@inheritdoc }
     */
    public subscribe(next: (actionEvent: TActionEvent) => void): Rx.Subscription
    {
        return this.observe().subscribe(next);
    }

    /**
     * {@inheritdoc }
     */
    public trigger(actionEvent: TActionEvent): void
    {
        this.subject.next(actionEvent);
    }
}

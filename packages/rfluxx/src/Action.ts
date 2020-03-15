import { Observable } from "rxjs-compat/Observable";
import { Subject } from "rxjs-compat/Subject";
import { Subscription } from "rxjs-compat/Subscription";

import { IAction } from "./IAction";
import { IObservableAction } from "./IObservableAction";

/**
 * Simple action class instatiated by stores.
 */
export class Action<TActionEvent> implements IObservableAction<TActionEvent>
{
    private subject: Subject<TActionEvent>;

    constructor()
    {
        this.subject = new Subject<TActionEvent>();
    }

    /**
     * {@inheritdoc }
     */
    public observe(): Observable<TActionEvent>
    {
        return this.subject;
    }

    /**
     * {@inheritdoc }
     */
    public subscribe(next: (actionEvent: TActionEvent) => void): Subscription
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

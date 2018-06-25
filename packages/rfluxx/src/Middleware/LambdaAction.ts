import { IObservableAction } from '..';
import { Observable, Subscription } from 'rxjs';

/**
 * This class allows to define actions on the fly by specifying a set of options.
 */
export class LambdaAction<T> implements IObservableAction<T> {
    constructor(
        private observeFunction: () => Observable<T>,
        private subscribeFunction: (next: (parameter: T) => void) => Subscription,
        private triggerFunction: (actionEvent: T) => void,
    ) {
        
    }

    public observe(): Observable<T> {
        return this.observeFunction();
    }

    public subscribe(next: (parameter: T) => void): Subscription {
        return this.subscribeFunction(next);
    }

    public trigger(actionEvent: T): void {
        this.triggerFunction(actionEvent);
    }
}
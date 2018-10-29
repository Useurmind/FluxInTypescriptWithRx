import { IObservableAction } from '..';
import { Observable, Subscription } from 'rxjs';

/**
 * This class allows to define actions on the fly by specifying a set of functions to execute 
 * for the different methods of an action.
 */
export class LambdaAction<T> implements IObservableAction<T> {
    /**
     * Create a new action configured to execute the given functions.
     * @param observeFunction Called when observe is called on the action.
     * @param subscribeFunction Called when subscribe is called on the action.
     * @param triggerFunction Called when trigger is called on the action.
     */
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
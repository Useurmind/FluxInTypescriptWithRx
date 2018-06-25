import { IAction, IObservableAction } from '..';
import { Observable, Subscription } from 'rxjs';
import { LambdaAction } from './LambdaAction';

/**
 * Interface for options to define how an action is wrapped.
 */
export interface IActionWrapperOptions<T> {
    observe?: (action: IObservableAction<T>) => Observable<T>;
    subscribe?: (action: IObservableAction<T>, next: (parameter: T) => void) => Subscription;
    trigger?: (action: IObservableAction<T>, actionEvent: T) => void;
}

/**
 * Call this method to wrap an action.
 * @param action The action to wrap.
 * @param options Defines how the action is wrapped.
 * @returns The wrapped action.
 */
export function wrapAction<T>(action: IObservableAction<T>, options: IActionWrapperOptions<T>): IObservableAction<T> {
    let observeFunction = options.observe 
                                ? () => options.observe(action)
                                : () => action.observe();
    let subscribeFunction = options.subscribe 
                                ? (next: (parameter: T) => void) => options.subscribe(action, next)
                                : (next: (parameter: T) => void) => action.subscribe(next);
    let triggerFunction = options.trigger 
                                ? (actionEvent: T) => options.trigger(action, actionEvent)
                                : (actionEvent: T) => action.trigger(actionEvent);

    return new LambdaAction<T>(observeFunction, subscribeFunction, triggerFunction);
}
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { IActionFactory, IActionMetadata, SimpleActionFactory } from "../ActionFactory";
import { ActionHook } from "./ActionHook";
import { StoreStateSubject } from "./StoreState";

/**
 * A reducer is a simple function that takes the current state and an action event and produces a new state.
 */
export type Reducer<TState, TActionEvent> = (s: TState, actionEvent: TActionEvent) => TState;

/**
 * Create an action hool that will handle an action call by reducing its action event to a new state object.
 * @param state The state subject of the store
 * @param reducer 
 */
export function reduceAction<TState, TActionEvent>(
    state: StoreStateSubject<TState>,
    reducer: Reducer<TState, TActionEvent>): ActionHook<TActionEvent>
{
    const action = new SimpleActionFactory().create<TActionEvent>();

    action.subscribe(evt =>
    {
        const newState = reducer(state.value, evt);
        state.next(newState);
    });

    return (actionEvent: TActionEvent) => action.trigger(actionEvent);
}
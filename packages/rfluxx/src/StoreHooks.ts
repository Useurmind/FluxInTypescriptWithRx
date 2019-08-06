import { BehaviorSubject } from "rxjs";

import { IActionFactory, IActionMetadata, SimpleActionFactory } from "./ActionFactory";
import { IAction } from "./IAction";
import { IObservableAction } from "./IObservableAction";

export type ActionHook<TActionEvent> = (actionEvent: TActionEvent) => void;

export type HandleActionParams<TActionEvent> =
    ((actionEvent: TActionEvent) => void) | IComplexHandleActionParams<TActionEvent>;

export interface IComplexHandleActionParams<TActionEvent>
{
    handleAction: (action: IObservableAction<TActionEvent>) => void;
    actionMetadata?: IActionMetadata;
    actionFactory?: IActionFactory;
}

function isComplexHandleActionParam<TActionEvent>(params: HandleActionParams<TActionEvent>)
    : params is IComplexHandleActionParams<TActionEvent>
{
    if ((params as IComplexHandleActionParams<TActionEvent>).handleAction)
    {
        return true;
    }

    return false;
}

export const reduceAction = <TState>(state: BehaviorSubject<TState>) =>
    <TActionEvent>(reducer: Reducer<TState, TActionEvent>): ActionHook<TActionEvent> =>
{
    const action = new SimpleActionFactory().create<TActionEvent>();

    action.subscribe(evt =>
    {
        const newState = reducer(state.value, evt);
        state.next(newState);
    });

    return (actionEvent: TActionEvent) => action.trigger(actionEvent);
}

export function handleAction<TActionEvent>(params: HandleActionParams<TActionEvent>): ActionHook<TActionEvent>
{
    let action: IObservableAction<TActionEvent> = null;

    if (isComplexHandleActionParam(params))
    {
        const actionFactory = params.actionFactory ? params.actionFactory : new SimpleActionFactory();

        action = actionFactory.create(params.actionMetadata);
        params.handleAction(action);
    }
    else
    {
        action = new SimpleActionFactory().create();
        action.subscribe(params);
    }

    return (actionEvent: TActionEvent) => action.trigger(actionEvent);
}

export type Reducer<TState, TActionEvent> = (s: TState, actionEvent: TActionEvent) => TState;

export const createReducer = <TState>(state: BehaviorSubject<TState>) =>
    <TActionEvent>(reducer: Reducer<TState, TActionEvent>): Reducer<TState, TActionEvent> =>
{
    return reducer;
};

import { IActionFactory, IActionMetadata, SimpleActionFactory } from "../ActionFactory";
import { IAction } from "../IAction";
import { IObservableAction } from "../IObservableAction";
import { ActionHook, ActionHookVoid } from "./ActionHook";

/**
 * Action parameters can either be a simple callback or a complex object containing additional metadata
 * for then action.
 */
export type HandleActionParams<TActionEvent> =
    ((actionEvent: TActionEvent) => void) | IComplexHandleActionParams<TActionEvent>;

export interface IComplexHandleActionParams<TActionEvent>
{
    /**
     * Handler that is called when the action is triggered.
     */
    handleAction: (action: IObservableAction<TActionEvent>) => void;

    /**
     * Metadata for the action or a function to create the metadata.
     */
    actionMetadata?: IActionMetadata | (() => IActionMetadata);

    /**
     * The action factory to create the action.
     */
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

/**
 * Handle an action without an action event.
 * @param params The parameters that define how the action is being handled.
 */
export function handleActionVoid(params: HandleActionParams<void>): ActionHookVoid
{
    return handleAction(params) as ActionHookVoid;
}

/**
 * Handle an action with an action event.
 * @param params The parameters that define how the action is being handled.
 */
export function handleAction<TActionEvent>(params: HandleActionParams<TActionEvent>): ActionHook<TActionEvent>
{
    let action: IObservableAction<TActionEvent> = null;

    if (isComplexHandleActionParam(params))
    {
        const actionFactory = params.actionFactory ? params.actionFactory : new SimpleActionFactory();

        let actionMetadata: IActionMetadata = null;
        if(params.actionMetadata) {
            if(typeof params.actionMetadata === "function")
            {
                actionMetadata = params.actionMetadata();
            }
            else
            {
                actionMetadata = params.actionMetadata;
            }
        }

        action = actionFactory.create(actionMetadata);
        params.handleAction(action);
    }
    else
    {
        action = new SimpleActionFactory().create();
        action.subscribe(params);
    }

    return (actionEvent: TActionEvent) => action.trigger(actionEvent);
}

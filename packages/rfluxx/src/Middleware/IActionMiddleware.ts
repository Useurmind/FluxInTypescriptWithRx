import { IActionMetadata } from "../ActionFactory/IActionMetadata";
import { IObservableAction } from "../IObservableAction";

/**
 * Interface for action middleware.
 * Action middleware will take an action and do whatever it needs to do with it.
 * This can be:
 * - subscribing the action
 * - wrapping the action and returning a wrapper (see {@see LambdaAction} for wraping an action)
 */
export interface IActionMiddleware {
    /**
     * Apply the middleware to the action.
     * @param action The action to which the middleware should be applied.
     * @param actionMetadata Metadata describing the action.
     * @returns An action that should be used instead of the original action.
     */
    apply<TActionEvent>(action: IObservableAction<TActionEvent>, actionMetadata: IActionMetadata): IObservableAction<TActionEvent>;
}

import { IObservableAction } from "../IObservableAction";

import { IActionMetadata } from "./IActionMetadata";

/**
 * Interface for creating actions.
 */
export interface IActionFactory {
    /**
     * Create an action with given action event type.
     * @param actionMetadata Metadata that describes the action.
     */
    create<TActionEvent>(actionMetadata?: IActionMetadata): IObservableAction<TActionEvent>;
}

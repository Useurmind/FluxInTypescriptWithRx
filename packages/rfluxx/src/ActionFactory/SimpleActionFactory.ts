import { Action } from "../Action";
import { IObservableAction } from "../IObservableAction";

import { IActionFactory } from "./IActionFactory";
import { IActionMetadata } from "./IActionMetadata";

/**
 * This is a very simple action factory that does nothing special about the actions.
 * Used by the stores as a fallback if no other action factory is given.
 */
export class SimpleActionFactory implements IActionFactory {
    public create<TActionEvent>(actionMetadata?: IActionMetadata): IObservableAction<TActionEvent> {
        return new Action<TActionEvent>();
    }
}

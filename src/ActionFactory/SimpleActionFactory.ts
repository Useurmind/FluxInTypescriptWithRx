import { IObservableAction } from "../IObservableAction";
import { Action } from "../Action";
import { IActionFactory } from "./IActionFactory";
import { IActionMetadata } from './IActionMetadata';

/**
 * This is a very simple action factory that does nothing special about the actions.
 * Used by the stores if no special action factory is given.
 */
export class SimpleActionFactory implements IActionFactory {
    public create<TActionEvent>(actionMetadata?: IActionMetadata): IObservableAction<TActionEvent> {
        return new Action<TActionEvent>();
    }
}
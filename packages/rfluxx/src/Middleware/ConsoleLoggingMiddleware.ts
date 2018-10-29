import { IActionMetadata } from "../ActionFactory/IActionMetadata";
import { IObservableAction } from "../IObservableAction";

import { IActionMiddleware } from ".";

/**
 * This middleware logs the different action events to the console.
 */
export class ConsoleLoggingMiddleware implements IActionMiddleware {
    public apply<TActionEvent>(action: IObservableAction<TActionEvent>, actionMetadata: IActionMetadata): IObservableAction<TActionEvent> {
        action.subscribe(actionEvent => {
            const actionJson = JSON.stringify(actionEvent);
            const actionMetadataJson = JSON.stringify(actionMetadata);
            console.info(`Action ${actionMetadataJson} executed: ${actionJson}`);
        });
        return action;
    }
}

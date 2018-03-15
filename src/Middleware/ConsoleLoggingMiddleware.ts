import { IActionMiddleware } from '.';
import { IObservableAction } from '../IObservableAction';
import { IActionMetadata } from '../ActionFactory/IActionMetadata';

/**
 * This middleware logs the different action events to the console.
 */
export class ConsoleLoggingMiddleware implements IActionMiddleware {
    public apply<TActionEvent>(action: IObservableAction<TActionEvent>, actionMetadata: IActionMetadata): IObservableAction<TActionEvent> {
        action.subscribe(actionEvent => {
            let actionJson = JSON.stringify(actionEvent);
            let actionMetadataJson = JSON.stringify(actionMetadata);
            console.info(`Action ${actionMetadataJson} executed: ${actionJson}`);
        })
        return action;
    }
}
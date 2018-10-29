import { Action } from "../Action";
import { IObservableAction } from "../IObservableAction";
import { IActionMiddleware } from "../Middleware";

import { IActionFactory } from "./IActionFactory";
import { IActionMetadata } from "./IActionMetadata";

/**
 * This action factory applies arbitrary middleware to the actions.
 */
export class MiddlewareActionFactory implements IActionFactory {
    /**
     * Create an instance of this class.
     * @param middleware The middleware that will be applied in order to wrap created actions.
     */
    constructor(private middleware: IActionMiddleware[]) {

    }

    public create<TActionEvent>(actionMetadata?: IActionMetadata): IObservableAction<TActionEvent> {
        let action: IObservableAction<TActionEvent> = new Action<TActionEvent>();
        actionMetadata = actionMetadata ? actionMetadata : { name: "none" };

        this.middleware.forEach(m => {
            action = m.apply(action, actionMetadata);
        });

        return action;
    }
}

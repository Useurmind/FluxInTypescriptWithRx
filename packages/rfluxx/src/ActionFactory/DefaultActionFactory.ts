import { IActionMiddleware, IObservableAction } from "..";

import { IActionFactory, IActionMetadata, MiddlewareActionFactory } from ".";
import { IActionRegistry } from "./IActionRegistry";

/**
 * This action factory combines several abilities.
 * - Add middleware to action
 * - Inject a prefix into actions created by stores.
 */
export class DefaultActionFactory implements IActionFactory
{
    private middlewareActionFactory: MiddlewareActionFactory;

    constructor(middleware: IActionMiddleware[], private actionRegistry: IActionRegistry)
    {
        this.middlewareActionFactory = new MiddlewareActionFactory(middleware);
    }

    public create<TActionEvent>(actionMetadata?: IActionMetadata): IObservableAction<TActionEvent>
    {
        const action = this.middlewareActionFactory.create<TActionEvent>(actionMetadata);

        this.actionRegistry.registerAction(actionMetadata, action);

        return action;
    }
}

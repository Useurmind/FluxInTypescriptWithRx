import { IObservableAction } from "../IObservableAction";

import { IActionFactory } from "./IActionFactory";
import { IActionMetadata } from "./IActionMetadata";

/**
 * This action factory adds a full path to the action metadata by prefixing the action name
 * with the given prefix.
 */
export class PrefixActionFactory implements IActionFactory
{
    constructor(private actionFactory: IActionFactory, private prefix: string)
    {

    }

    public create<TActionEvent>(actionMetadata?: IActionMetadata): IObservableAction<TActionEvent>
    {
        if (!actionMetadata.name && !actionMetadata.fullPath)
        {
            throw new Error("Cannot prefix action to full path without action name. " +
                            "Set the action name via IActionMetadata when creating the action.");
        }

        if (!actionMetadata.fullPath)
        {
            // only set full path if not already set
            actionMetadata.fullPath = `${this.prefix}.${actionMetadata.name}`;
        }

        const action = this.actionFactory.create<TActionEvent>(actionMetadata);

        return action;
    }
}

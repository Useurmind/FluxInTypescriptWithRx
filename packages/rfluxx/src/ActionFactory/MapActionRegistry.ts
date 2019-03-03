import { IActionMetadata } from ".";
import { IActionRegistry } from "./IActionRegistry";

/**
 * An implementation of { @see IActionRegistry } that uses a map for action storage.
 */
export class MapActionRegistry implements IActionRegistry
{
    private actions: Map<string, any>;

    constructor()
    {
        this.actions = new Map();
    }

    public registerAction(actionMetadata: IActionMetadata, action: any): void
    {
        const fullPath = actionMetadata.fullPath;
        if (this.actions.has(fullPath))
        {
            throw new Error(`Action with full path ${fullPath} is already registered in action registry`);
        }

        this.actions.set(fullPath, action);
    }

    public getActionByPath(fullPath: string): any
    {
        if (!this.actions.has(fullPath))
        {
            throw new Error(`Could not find action with full path ${fullPath} in action registry`);
        }

        return this.actions.get(fullPath);
    }

    public getAction(actionMetadata: IActionMetadata): any
    {
        return this.getActionByPath(actionMetadata.fullPath);
    }
}

import { IActionMetadata } from ".";

/**
 * Interface for retrieving actions by a string key.
 */
export interface IActionRegistry
{
    /**
     * Register an action in the registry.
     * @param actionMetadata The metadata describing the action.
     * @param action The action object.
     */
    registerAction(actionMetadata: IActionMetadata, action: any): void;

    /**
     * Get the action that was registered for the given full path.
     * @param actionMetadata The metadata describing the action.
     */
    getAction(actionMetadata: IActionMetadata): any;
}

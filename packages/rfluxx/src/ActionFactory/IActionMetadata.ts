/**
 * Metadata that can be stated when creating an action.
 */
export interface IActionMetadata
{
    /**
     * Name of the action (usually unique inside a store).
     */
    name?: string;

    /**
     * A unique full path of the action (unique per page).
     */
    fullPath?: string;
}

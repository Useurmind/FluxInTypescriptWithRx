/**
 * Interface for actions that can be called from UI components.
 */
export interface IAction<TActionEvent> {
    /**
     * Execute the command.
     * @param actionEvent The even to trigger.
     * @returns {}
     */
    trigger(actionEvent: TActionEvent): void;
}

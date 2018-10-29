import { IActionEvent } from "./IActionEvent";

/**
 * Data structure that holds action events.
 */
export interface IActionEventLog {
    /**
     * Get the events in the log.
     */
    readonly actionEvents: IActionEvent[];

    /**
     * Add an event to the log.
     */
    addEvent(actionEvent: IActionEvent): void;

    /**
     * Set an action as active or inactive.
     */
    setActive(sequenceNumber: number, isActive: boolean): void;
}

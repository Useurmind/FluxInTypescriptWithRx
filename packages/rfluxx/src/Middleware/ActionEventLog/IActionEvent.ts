import { IObservableAction, IActionMetadata } from '../..';

/**
 * Interface for events that describe an action event fully.
 */
export interface IActionEvent {
    /** 
     * This is the action on which the event was observed.
     */
    action?: IObservableAction<any>

    /**
     * This is the actual event data of the action event.
     */
    actionEventData: any;

    /**
     * Metadata describing the action.
     */
    actionMetaData: IActionMetadata;

    /**
     * Time when the action event was first recorded.
     */
    firstTime?: Date;

    /**
     * Time when the action event was last recorded.
     */
    lastTime?: Date;

    /**
     * The number of the event in the log (if actions are deleted from the log this is not adapted).
     */
    sequenceNumber?: number;

    /**
     * Should the event be respected for replay and other stuff (perhaps there will be something in the future).
     */
    isActive?: boolean;
}
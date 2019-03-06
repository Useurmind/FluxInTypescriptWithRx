import { IActionEvent } from "./IActionEvent";

export interface IActionEventLogPreserver
{
    /**
     * Get an array of all action events stored in the persistent storage.
     */
    getPersistedActionEvents(): IActionEvent[];

    /**
     * Clear all action events stored in the persistent storage.
     */
    clearPersistedEvents(): void;
}

/**
 * Can store action events from the event log in the local storage of the browser.
 * See https://www.w3schools.com/html/html5_webstorage.asp.
 */
export class ActionEventLogPreserver implements IActionEventLogPreserver
{
    private readonly actionEventCountBaseKey: string = "ActionEventCount";
    private readonly actionEventBaseKey: string = "ActionEvent";

    constructor(private storagePrefix: string)
    {
    }

    /**
     * Store a new action event log in persistent storage.
     * @param actionEvent The action event to store.
     */
    public persistActionEvent(actionEvent: IActionEvent): void
    {
        // throw out stuff that can not be serialized as json
        const savedActionEvent = {
            ...actionEvent,
            action: undefined
        };

        const actionEventKey = this.getActionEventKey(savedActionEvent.sequenceNumber);
        const actionEventString = JSON.stringify(savedActionEvent);
        window.localStorage.setItem(actionEventKey, actionEventString);
        this.setActionEventCount(actionEvent.sequenceNumber + 1);
    }

    /**
     * Get an array of all action events stored in the persistent storage.
     */
    public getPersistedActionEvents(): IActionEvent[]
    {
        const eventCount = this.getActionEventCount();
        const eventArray = new Array(eventCount);

        for (let index = 0; index < eventCount; index++)
        {
            eventArray[index] =  this.getActionEvent(index);
        }

        return eventArray;
    }

    /**
     * Clear all action events stored in the persistent storage.
     */
    public clearPersistedEvents(): void
    {
        const eventCount = this.getActionEventCount();

        for (let index = 0; index < eventCount; index++)
        {
            window.localStorage.removeItem(this.getActionEventKey(index));
        }

        window.localStorage.removeItem(this.getActionEventCountKey());
    }

    private getActionEvent(sequenceNumber: number): IActionEvent
    {
        const actionEventKey = this.getActionEventKey(sequenceNumber);
        const actionEventString = window.localStorage.getItem(actionEventKey);

        const actionEvent = JSON.parse(actionEventString);
        return actionEvent;
    }

    private getActionEventKey(sequenceNumber: number): string
    {
        return `${this.storagePrefix}.${this.actionEventBaseKey}[${sequenceNumber}]`;
    }

    private getActionEventCount(): number
    {
        const key = this.getActionEventCountKey();

        const countItem = window.localStorage.getItem(key);
        if (countItem === null || countItem === undefined)
        {
            return 0;
        }

        return Number.parseInt(countItem);
    }

    private setActionEventCount(count: number)
    {
        const key = this.getActionEventCountKey();

        window.localStorage.setItem(key, count.toString());
    }

    private getActionEventCountKey(): string
    {
        return `${this.storagePrefix}.${this.actionEventCountBaseKey}`;
    }
}

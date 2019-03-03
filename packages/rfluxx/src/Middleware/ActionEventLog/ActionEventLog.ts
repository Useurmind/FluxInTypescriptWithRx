import { IObservableAction } from "../..";

import { ActionEventLogPreserver } from "./ActionEventLogPreserver";
import { IActionEvent } from "./IActionEvent";
import { IActionEventLog } from "./IActionEventLog";

/**
 * Implementation of an action event log that stores the action events in a simple array.
 */
export class ActionEventLog implements IActionEventLog
{
    private actionEventLog: IActionEvent[] = [];

    constructor(private actionEventLogPreserver?: ActionEventLogPreserver)
    {
        if (this.actionEventLogPreserver)
        {
            this.actionEventLog = this.actionEventLogPreserver.getPersistedActionEvents();
        }
    }

    /**
     * { @inheritdoc }
     */
    public get actionEvents(): IActionEvent[]
    {
        return this.actionEventLog;
    }

    /**
     * { @inheritdoc }
     */
    public addEvent(actionEvent: IActionEvent): void
    {
        actionEvent.sequenceNumber = this.actionEventLog.length;
        actionEvent.firstTime = new Date(Date.now());
        actionEvent.lastTime = actionEvent.firstTime;
        actionEvent.isActive = true;
        this.actionEventLog.push(actionEvent);

        if (this.actionEventLogPreserver)
        {
            this.actionEventLogPreserver.persistActionEvent(actionEvent);
        }
    }

    /**
     * { @inheritdoc }
     */
    public setActive(sequenceNumber: number, isActive: boolean): void
    {
        let actionEvent = this.actionEvents[sequenceNumber];
        if (actionEvent.sequenceNumber !== sequenceNumber)
        {
            actionEvent = this.actionEvents.find(a => a.sequenceNumber === sequenceNumber);
        }

        actionEvent.isActive = isActive;

        if (this.actionEventLogPreserver)
        {
            this.actionEventLogPreserver.persistActionEvent(actionEvent);
        }
    }
}

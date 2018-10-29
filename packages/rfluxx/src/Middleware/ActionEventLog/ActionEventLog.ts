import { IObservableAction } from "../..";

import { IActionEvent } from "./IActionEvent";
import { IActionEventLog } from "./IActionEventLog";

export class ActionEventLog implements IActionEventLog {
    private actionEventLog: IActionEvent[] = [];

    /**
     * { @inheritdoc }
     */
    public get actionEvents(): IActionEvent[] {
        return this.actionEventLog;
    }

    /**
     * { @inheritdoc }
     */
    public addEvent(actionEvent: IActionEvent): void {
        actionEvent.sequenceNumber = this.actionEventLog.length;
        actionEvent.firstTime = new Date(Date.now());
        actionEvent.lastTime = actionEvent.firstTime;
        actionEvent.isActive = true;
        this.actionEventLog.push(actionEvent);
    }

    /**
     * { @inheritdoc }
     */
    public setActive(sequenceNumber: number, isActive: boolean): void {
        let actionEvent = this.actionEvents[sequenceNumber];
        if (actionEvent.sequenceNumber != sequenceNumber) {
            actionEvent = this.actionEvents.find(a => a.sequenceNumber === sequenceNumber);
        }

        actionEvent.isActive = isActive;
    }
}

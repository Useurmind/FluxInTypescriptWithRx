import { IActionEventLog } from './IActionEventLog';
import { IActionMiddleware } from '..';
import { IObservableAction, IActionMetadata } from '../..';

export class ActionEventLogMiddleware implements IActionMiddleware {
    private isReplaying: boolean = false;

    constructor(private eventLog: IActionEventLog){

    }

    /**
     * Inform the middleware that replay has started.
     */
    public noteReplayStarted(): void {
        this.isReplaying = true;
    }

    /**
     * Inform the middleware that replay has finished.
     */
    public noteReplayEnded(): void {
        this.isReplaying = false;
    }


    public apply<TActionEvent>(action: IObservableAction<TActionEvent>, actionMetadata: IActionMetadata): IObservableAction<TActionEvent> {
        action.subscribe(actionEvent => {
            if(this.isReplaying) {
                return;
            }

            this.eventLog.addEvent({
                action: action,
                actionMetaData: actionMetadata,
                actionEventData: actionEvent
            })
        });

        return action;
    }
}
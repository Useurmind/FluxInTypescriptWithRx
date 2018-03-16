import { IActionEventLog } from './IActionEventLog';
import { IActionMiddleware } from '..';
import { IObservableAction, IActionMetadata } from '../..';
import { INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin } from './INeedToKnowAboutReplay';
import { applyMixins } from '../../Utility/Mixin';

export class ActionEventLogMiddleware implements INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin {

    constructor(private eventLog: IActionEventLog){

    }

    // NeedToKnowAboutReplay
    isReplaying: boolean = false;
    noteReplayStarted: () => void;
    noteReplayEnded: () => void;

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
applyMixins(ActionEventLogMiddleware, [NeedToKnowAboutReplayMixin])
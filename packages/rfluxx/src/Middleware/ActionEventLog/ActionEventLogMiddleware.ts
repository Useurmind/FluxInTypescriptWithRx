import { IActionEventLog } from './IActionEventLog';
import { IActionMiddleware } from '..';
import { IObservableAction, IActionMetadata } from '../..';
import { INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin } from './INeedToKnowAboutReplay';
import { applyMixins } from '../../Utility/Mixin';
import { INeedToKnowIfIAmInThePast } from './INeedToKnowIfIAmInThePast';
import { wrapAction } from '../WrapAction';

/**
 * This middleware is responsible for adding action events into the event log.
 * It is also aware of replay and will avoid adding action events twice by ignoring all action events during replay.
 */
export class ActionEventLogMiddleware implements INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin, INeedToKnowIfIAmInThePast {
    private hasTraveledToPast: boolean;

    constructor(private eventLog: IActionEventLog){

    }

    // NeedToKnowAboutReplay
    isReplaying: boolean = false;
    noteReplayStarted: () => void;
    noteReplayEnded: () => void;

    public setHasTraveledToPast(hasTraveledToPast: boolean): void {
        this.hasTraveledToPast = hasTraveledToPast;
    }

    public apply<TActionEvent>(action: IObservableAction<TActionEvent>, actionMetadata: IActionMetadata): IObservableAction<TActionEvent> {
        action.subscribe(actionEvent => {
            if(this.isReplaying) {
                // ignore incoming actions during replay
                return;
            }

            this.eventLog.addEvent({
                // we hand over the original action here because
                // the time traveler should be able to trigger it
                action: action,
                actionMetaData: actionMetadata,
                actionEventData: actionEvent
            });
        });

        return wrapAction(action,
            {
                trigger: (action, actionEvent) => {
                    // only trigger action if we have not traveled to past
                    // this should block the triggering of actions through
                    // - UI
                    // - stores
                    // - other components unaware of time travel
                    if(!this.hasTraveledToPast) {
                        action.trigger(actionEvent);
                    }
                }
            });
    }
}
applyMixins(ActionEventLogMiddleware, [NeedToKnowAboutReplayMixin])
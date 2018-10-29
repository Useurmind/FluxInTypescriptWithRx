import { IActionMiddleware } from "..";
import { IActionMetadata, IObservableAction } from "../..";
import { applyMixins } from "../../Utility/Mixin";
import { wrapAction } from "../WrapAction";

import { IActionEventLog } from "./IActionEventLog";
import { INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin } from "./INeedToKnowAboutReplay";
import { INeedToKnowIfIAmInThePast } from "./INeedToKnowIfIAmInThePast";

/**
 * This middleware is responsible for adding action events into the event log.
 * It is also aware of replay and will avoid adding action events twice by ignoring all action events during replay.
 */
export class ActionEventLogMiddleware
    implements INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin, INeedToKnowIfIAmInThePast
{
    /**
     * @inheritDoc
     */
    public isReplaying: boolean = false;

    /**
     * @inheritDoc
     */
    public noteReplayStarted: () => void;

    /**
     * @inheritDoc
     */
    public noteReplayEnded: () => void;

    /**
     * @inheritDoc
     */
    private hasTraveledToPast: boolean;

    /**
     * Create an instance of the middleware.
     * @param eventLog The event log in which the middleware should store the events.
     */
    constructor(private eventLog: IActionEventLog)
    {

    }

    /**
     * @inheritDoc
     */
    public setHasTraveledToPast(hasTraveledToPast: boolean): void
    {
        this.hasTraveledToPast = hasTraveledToPast;
    }

    /**
     * @inheritDoc
     */
    public apply<TActionEvent>(action: IObservableAction<TActionEvent>, actionMetadata: IActionMetadata)
        : IObservableAction<TActionEvent>
    {
        action.subscribe(actionEvent =>
        {
            if (this.isReplaying)
            {
                // ignore incoming actions during replay
                return;
            }

            this.eventLog.addEvent({
                // we hand over the original action here because
                // the time traveler should be able to trigger it
                action,
                actionMetaData: actionMetadata,
                actionEventData: actionEvent
            });
        });

        return wrapAction(action,
            {
                trigger: (action2, actionEvent) =>
                {
                    // only trigger action if we have not traveled to past
                    // this should block the triggering of actions through
                    // - UI
                    // - stores
                    // - other components unaware of time travel
                    if (!this.hasTraveledToPast)
                    {
                        action2.trigger(actionEvent);
                    }
                }
            });
    }
}
applyMixins(ActionEventLogMiddleware, [NeedToKnowAboutReplayMixin]);

import { IActionMetadata, IObservableAction } from "../..";
import { IActionRegistry } from "../../ActionFactory/IActionRegistry";
import { IResetMyState } from "../../IResetMyState";

import { ActionEventLogMiddleware } from "./ActionEventLogMiddleware";
import { IActionEventLog } from "./IActionEventLog";
import { INeedToKnowAboutReplay } from "./INeedToKnowAboutReplay";
import { INeedToKnowIfIAmInThePast } from "./INeedToKnowIfIAmInThePast";

/**
 * This is the class that controls the time travel process.
 * On the most basic level it
 * - turns off a lot of stuff
 * - replays the event log into the corresponding actions
 * - communicates whether we are in the past
 * - turns on a lot of stuff
 */
export class TimeTraveler
{
    /**
     * States whether currently we are in the past.
     * Being in the past for example indicates that no further commands may be executed.
     */
    private hasTraveledToPast: boolean;

    private resettableStates: IResetMyState[];

    /**
     * Create an instance of this class.
     * @param eventLog The event log that contains all action events.
     * @param getReplaySubscribers Get an array of all subscribers for occurences of replays.
     * @param getResetStates Get an array of every component that needs to be reset when beginning a replay.
     * @param getPastSubscribes Get an array of all subscribes that want to know whether we are in the past.
     * @param getAction A function that delivers an action based on the metadata that is handed in.
     */
    constructor(
        private eventLog: IActionEventLog,
        private getReplaySubscribers: () => INeedToKnowAboutReplay[],
        private getResetStates: () => IResetMyState[],
        private getPastSubsribers: () => INeedToKnowIfIAmInThePast[],
        private actionRegistry: IActionRegistry
    )
    {
        this.hasTraveledToPast = false;
        this.getPastSubsribers().forEach(subscriber => subscriber.setHasTraveledToPast(this.hasTraveledToPast));

        this.resettableStates = this.getResetStates();

        this.travelTo(this.eventLog.actionEvents.length);
    }

    /**
     * Travel in time to a specific action event.
     * @param sequenceNumber The sequence number of the action to which to travel.
     */
    public travelTo(sequenceNumber: number): void
    {
        const replaySubscribers = this.getReplaySubscribers();
        try
        {
            replaySubscribers.forEach(s => s.noteReplayStarted());

            this.resettableStates.forEach(resettableState =>
            {
                resettableState.resetState();
            });

            // some: lets us execute the given function until we return true
            this.eventLog.actionEvents.some(actionEvent =>
            {
                if (actionEvent.isActive)
                {
                    if (!actionEvent.action)
                    {
                        actionEvent.action = this.actionRegistry.getAction(actionEvent.actionMetaData);
                    }

                    const action = actionEvent.action;

                    action.trigger(actionEvent.actionEventData);
                }

                // replay all active actions until including the target sequence number
                return  actionEvent.sequenceNumber >= sequenceNumber;
            });

            // update if we are in the past
            const lastEvent = this.eventLog.actionEvents.slice(-1).pop();
            this.hasTraveledToPast = lastEvent && sequenceNumber < lastEvent.sequenceNumber ? true : false;
            this.getPastSubsribers().forEach(subscriber => subscriber.setHasTraveledToPast(this.hasTraveledToPast));
        }
        finally
        {
            replaySubscribers.forEach(s => s.noteReplayEnded());
        }
    }
}

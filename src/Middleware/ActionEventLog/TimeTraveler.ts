import { IActionEventLog } from './IActionEventLog';
import { ActionEventLogMiddleware } from './ActionEventLogMiddleware';
import { IResetMyState } from '../../IResetMyState';
import { IActionMetadata, IObservableAction } from '../..';
import { INeedToKnowIfIAmInThePast } from './INeedToKnowIfIAmInThePast';

export class TimeTraveler {
    /**
     * States whether currently we are in the past.
     * Being in the past for example indicates that no further commands may be executed.
     */
    private hasTraveledToPast: boolean;

    constructor(
        private eventLog: IActionEventLog,
        private eventLogMiddleware: ActionEventLogMiddleware,
        private getResetStates: () => IResetMyState[],
        private getPastSubsribers: () => INeedToKnowIfIAmInThePast[],
        private getAction: (actionMetadata: IActionMetadata) => IObservableAction<any>
    ){
        this.hasTraveledToPast = false;
        this.getPastSubsribers().forEach(subscriber => subscriber.setHasTraveledToPast(this.hasTraveledToPast))
    }

    /**
     * Travel in time to a specific action event.
     * @param sequenceNumber The sequence number of the action to which to travel.
     */
    public travelTo(sequenceNumber: number): void {
        try {
            this.eventLogMiddleware.noteReplayStarted();

            this.getResetStates().forEach(resettableState => {
                resettableState.resetState();
            });

            // some: lets us execute the given function until we return true
            this.eventLog.actionEvents.some(actionEvent => {
                if(actionEvent.isActive) {
                    let action = actionEvent.action ? actionEvent.action : this.getAction(actionEvent.actionMetaData);

                    action.trigger(actionEvent.actionEventData);
                }

                // replay all active actions until including the target sequence number
                return  actionEvent.sequenceNumber >= sequenceNumber;
            })

            // update if we are in the past
            let lastEvent = this.eventLog.actionEvents.slice(-1).pop()            
            this.hasTraveledToPast = lastEvent && sequenceNumber < lastEvent.sequenceNumber ? true : false;
            this.getPastSubsribers().forEach(subscriber => subscriber.setHasTraveledToPast(this.hasTraveledToPast))
        } finally {
            this.eventLogMiddleware.noteReplayEnded();
        }
    }
}
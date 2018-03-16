import { IActionEventLog } from './IActionEventLog';
import { ActionEventLogMiddleware } from './ActionEventLogMiddleware';
import { IResetMyState } from '../../IResetMyState';
import { IActionMetadata, IObservableAction } from '../..';

export class TimeTraveler {
    constructor(
        private eventLog: IActionEventLog,
        private eventLogMiddleware: ActionEventLogMiddleware,
        private getResetStates: () => IResetMyState[],
        private getAction: (actionMetadata: IActionMetadata) => IObservableAction<any>
    ){

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

            this.eventLog.actionEvents.some(actionEvent => {
                if(actionEvent.isActive) {
                    let action = actionEvent.action ? actionEvent.action : this.getAction(actionEvent.actionMetaData);

                    action.trigger(actionEvent.actionEventData);
                }

                // replay all active actions until including the target sequence number
                return  actionEvent.sequenceNumber >= sequenceNumber;
            })

        } finally {
            this.eventLogMiddleware.noteReplayEnded();
        }
    }
}
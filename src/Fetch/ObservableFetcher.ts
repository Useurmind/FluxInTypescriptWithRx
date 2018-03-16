import { Observable } from 'rxjs/Rx';
import { applyMixins } from '../Utility/Mixin';
import { INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin } from '../Middleware/ActionEventLog/INeedToKnowAboutReplay';
import { IObservableFetcher } from './IObservableFetcher';

/**
 * Wraps a fetch call with an observable.
 * This is completely transparent, no extra logic for fetch.
 * It also implements the INeedToKnowAboutReplay interface and will not actually fetch when replaying.
 */
export class ObservableFetcher implements IObservableFetcher,  INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin {
    
    public fetch(requestInfo: RequestInfo, init?: RequestInit): Observable<Response> {
        if(this.isReplaying) {
            return Observable.empty();
        }

        return Observable.fromPromise(fetch(requestInfo, init));
    }

    // NeedToKnowAboutReplay
    isReplaying: boolean = false;
    noteReplayStarted: () => void;
    noteReplayEnded: () => void;
}
applyMixins(ObservableFetcher, [NeedToKnowAboutReplayMixin]);
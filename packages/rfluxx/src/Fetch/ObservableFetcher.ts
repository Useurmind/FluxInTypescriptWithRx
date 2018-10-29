import { Observable } from "rxjs/Rx";

import { INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin } from "../Middleware/ActionEventLog/INeedToKnowAboutReplay";
import { applyMixins } from "../Utility/Mixin";

import { IObservableFetcher } from "./IObservableFetcher";

/**
 * Wraps a fetch call with an observable.
 * This is completely transparent, no extra logic for fetch.
 * It also implements the { @see INeedToKnowAboutReplay } interface and will not actually fetch when replaying.
 */
export class ObservableFetcher implements IObservableFetcher,  INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin {

    // NeedToKnowAboutReplay
    public isReplaying: boolean = false;
    public noteReplayStarted: () => void;
    public noteReplayEnded: () => void;

    public fetch(requestInfo: RequestInfo, init?: RequestInit): Observable<Response> {
        if (this.isReplaying) {
            return Observable.empty();
        }

        return Observable.fromPromise(fetch(requestInfo, init));
    }
}
applyMixins(ObservableFetcher, [NeedToKnowAboutReplayMixin]);

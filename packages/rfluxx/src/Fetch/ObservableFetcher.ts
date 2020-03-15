import { empty } from "rxjs";
import { Observable } from "rxjs-compat/Observable";
import { fromPromise } from "rxjs-compat/observable/fromPromise";

import { INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin } from "../Middleware/ActionEventLog/INeedToKnowAboutReplay";
import { applyMixins } from "../Utility/Mixin";

import { IObservableFetcher } from "./IObservableFetcher";

/**
 * Wraps a fetch call with an observable.
 * This is completely transparent, no extra logic for fetch.
 * It also implements the { @see INeedToKnowAboutReplay } interface and will not actually fetch when replaying.
 */
export class ObservableFetcher implements IObservableFetcher,  INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin
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
    public fetch(requestInfo: RequestInfo, init?: RequestInit): Observable<Response>
    {
        if (this.isReplaying)
        {
            return empty();
        }

        return fromPromise(fetch(requestInfo, init));
    }
}
applyMixins(ObservableFetcher, [NeedToKnowAboutReplayMixin]);

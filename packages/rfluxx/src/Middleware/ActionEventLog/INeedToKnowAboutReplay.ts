/**
 * Interface for classes that need to know when a replay is happening.
 */
export interface INeedToKnowAboutReplay {
    /**
     * Inform the object that replay has started.
     */
    noteReplayStarted(): void;

    /**
     * Inform the object that replay has finished.
     */
    noteReplayEnded(): void;
}

/**
 * Mixin that can be used to implement { @see INeedToKnowAboutReplay }.
 */
export class NeedToKnowAboutReplayMixin {
    public isReplaying: boolean;

    /**
     * Inform the object that replay has started.
     */
    public noteReplayStarted(): void {
        this.isReplaying = true;
    }

    /**
     * Inform the object that replay has finished.
     */
    public noteReplayEnded(): void {
        this.isReplaying = false;
    }
}

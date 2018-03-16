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

export class NeedToKnowAboutReplayMixin {
    isReplaying: boolean;

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
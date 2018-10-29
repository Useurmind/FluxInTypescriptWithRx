/**
 * Interface that can be implemented by components that need to know
 * about whether time travel has taken place.
 */
export interface INeedToKnowIfIAmInThePast {
    /**
     * Set a value that indicates whether we are currently in the past.
     */
    setHasTraveledToPast(hasTraveledToPast: boolean): void;
}

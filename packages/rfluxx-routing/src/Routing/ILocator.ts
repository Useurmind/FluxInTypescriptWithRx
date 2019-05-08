/**
 * An abstraction for interfacing with the window.location and history apis
 * for the router store.
 */
export interface ILocator
{
    /**
     * Get or set the current location.
     * In browser mapped to window.location.
     */
    location: URL;

    /**
     * States if history mode routing can be used.
     */
    isHistoryAvailable: boolean;

    /**
     * Add a history entry.
     * In browser mapped to history.pushState
     */
    pushHistoryState(data: any, title: string, url: string);

    /**
     * Replace a history entry.
     * In browser mapped to history.replaceState
     */
    replaceHistoryState(data: any, title: string, url: string);
}

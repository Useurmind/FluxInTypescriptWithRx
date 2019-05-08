import { ILocator } from "./ILocator";

/**
 * An implementation of the locator service for the router store for in browser usage.
 */
export class BrowserLocator implements ILocator
{
    /**
     * Get window.location.
     */
    public get location(): URL
    {
        return new URL(window.location.href);
    }

    /**
     * Set window.location.
     */
    public set location(value: URL)
    {
        window.location.href = value.href;
    }

    /**
     * States if history is available in the current browser.
     */
    public get isHistoryAvailable(): boolean
    {
        return !!history.pushState;
    }

    /**
     * Execute history.pushState
     */
    public  pushHistoryState(data: any, title: string, url: string)
    {
        history.pushState(data, title, url);
    }

    /**
     * Execute history.replaceState
     */
    public replaceHistoryState(data: any, title: string, url: string)
    {
        history.replaceState(data, title, url);
    }
}

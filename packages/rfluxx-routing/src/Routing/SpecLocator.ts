import { ILocator } from "./ILocator";

/**
 * An implementation of the locator service for unit testing.
 */
export class SpecLocator implements ILocator
{
    private readonly rootUrl: string;

    /**
     * @param location The starting location.
     */
    constructor( private _location: string, rootPath: string){
        const locationUrl = new URL(this._location);
        this.rootUrl = locationUrl.protocol + locationUrl.host + locationUrl.port + rootPath;
    }

    /**
     * Get window.location.
     */
    public get location(): URL
    {
        return this._location ? new URL(this._location) : null;
    }

    /**
     * Set window.location.
     */
    public set location(value: URL)
    {
        this._location = value.href;
    }

    /**
     * States if history is available in the current browser.
     */
    public get isHistoryAvailable(): boolean
    {
        return true;
    }

    /**
     * Execute history.pushState
     */
    public pushHistoryState(data: any, title: string, url: string)
    {
        if(url.startsWith("http")) {
            this._location = url;
        } else {
            this._location = this.rootUrl + url;
        }
    }

    /**
     * Execute history.replaceState
     */
    public replaceHistoryState(data: any, title: string, url: string)
    {
        // TODO improve this later
        this.pushHistoryState(data, title, url);
    }
}

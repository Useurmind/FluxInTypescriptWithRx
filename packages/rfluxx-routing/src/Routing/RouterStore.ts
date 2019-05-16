import * as Rfluxx from "rfluxx";
import { applyMixins, IAction, IInjectedStoreOptions, NeedToKnowAboutReplayMixin } from "rfluxx";

import { IRouteMatchStrategy } from "../RouteMatching/IRouteMatchStrategy";
import { ILocator } from './ILocator';
import { BrowserLocator } from './BrowserLocator';

export type RouteParameters = Map<string, string>;

/**
 * Interface for a route that can be entered.
 */
export interface IRoute
{
    /**
     * An expression that is used to check if the route matches the url.
     * Can also contain named group, e.g. (?<name>regex) that can be used to capture
     * values for parameters of the route.
     * Expressions should be unique values that identify the route clearly.
     */
    expression: string;
}

/**
 * This interface describes that a specific route was hit by the url.
 */
export interface IRouteHit
{
    /**
     * The route that was hit.
     */
    route: IRoute;

    /**
     * The url that leads to the route being hit.
     */
    url: URL;

    /**
     * A set of parameters that was extracted from the regular expression in the route
     * through named group capturing.
     */
    parameters: RouteParameters;
}

/**
 * Different modes in which the router can operate.
 */
export enum RouterMode
{
    /**
     * Work in the default history of the browser using url segments.
     */
    History,

    /**
     * Work with hash url segments that are appended to the url of the site.
     */
    Hash
}

/**
 * Arguments for the navigate action.
 */
export interface INavigateActionParams
{
    /**
     * Url to navigate to.
     * Set this or the path.
     */
    url?: URL | string;

    /**
     * Path to navigate to.
     * Set this or the url.
     */
    path?: string;

    /**
     * Replace the current history entry with
     * the new route.
     */
    replaceHistoryEntry?: boolean;
}

/**
 * The options to configure the { @see RouterStore }
 */
export interface IRouterStoreOptions extends IInjectedStoreOptions
{
    /**
     * The routes that the router store should match and signal.
     */
    routes: IRoute[];

    /**
     * The mode in which the router should operate.
     */
    mode?: RouterMode;

    /**
     * The root url of the page.
     */
    root?: string;

    /**
     * The strategy used to match urls against routes.
     */
    routeMatchStrategy: IRouteMatchStrategy;

    /**
     * A locator to use.
     * By default the { @see BrowserLocator } is used.
     */
    locator?: ILocator;

    /**
     * By default the store does automatically start listening to url changes.
     * Use this option to avoid this.
     */
    doNotAutoConnect?: boolean;
}

/**
 * The state of the { @see RouterStore }
 */
export interface IRouterStoreState
{
    /**
     * The route that was hit last and should be active at the moment.
     */
    currentHit: IRouteHit;

    /**
     * Is the router store currently connected and parsing routes.
     */
    isConnected: boolean;
}

/**
 * Interface to interact with the { @see RouterStore }.
 */
export interface IRouterStore extends Rfluxx.IStore<IRouterStoreState>
{
    /**
     * Navigate to the path given as an argument to the action.
     */
    navigateToPath: IAction<string>;

    /**
     * Navigate to the url given as an argument to the action.
     */
    navigateToUrl: IAction<URL>;

    /**
     * Navigate to a new route.
     */
    navigate: IAction<INavigateActionParams>;

    /**
     * Start parsing the url for routes.
     */
    connect: IAction<any>;

    /**
     * Stop parsing the url for routes.
     */
    disconnect: IAction<any>;

    /**
     * Get the href that can be applied to links from a path segment.
     * @param path The path segment. The href can differ from this segment for e.g. hash routing.
     */
    getHref(path: string): string;

    /**
     * Get the href that can be applied to links from a path segment.
     * @param path The path segment. The href can differ from this segment for e.g. hash routing.
     */
    getUrl(path: string): URL;
}

/**
 * This store listens to changes of the url and signals the match for the currently active route.
 */
export class RouterStore extends Rfluxx.Store<IRouterStoreState> implements NeedToKnowAboutReplayMixin
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
    public readonly navigateToPath: IAction<string>;

    /**
     * @inheritDoc
     */
    public readonly navigateToUrl: IAction<URL>;

    /**
     * @inheritDoc
     */
    public readonly connect: IAction<any>;

    /**
     * @inheritDoc
     */
    public readonly disconnect: IAction<AnalyserOptions>;

    /**
     * @inheritDoc
     */
    public readonly navigate: IAction<INavigateActionParams>;

    /**
     * Interval number used to listen to url changes periodically.
     */
    private interval: number = null;

    /**
     * The last fragment that was read from the locator.
     */
    private currentFragemt: string = null;

    constructor(private options: IRouterStoreOptions)
    {
        super({
            initialState: {
                currentHit: null,
                isConnected: false
            }
        });

        if (!this.options.locator)
        {
            this.options.locator = new BrowserLocator();
        }

        const historyModeChosen: boolean = this.options.mode !== undefined;

        if (!historyModeChosen)
        {
            this.options.mode = this.options.locator.isHistoryAvailable ? RouterMode.History : RouterMode.Hash;
        }
        this.options.root = this.options.root !== undefined
                                ? this.clearDoubleSlashes("/" + this.clearEndSlashes(options.root))
                                : this.options.locator.location.pathname;

        console.info("root for router store is " + this.options.root);

        this.navigateToPath = this.createActionAndSubscribe(s => this.onNavigateToPath(s, false));
        this.navigateToUrl = this.createActionAndSubscribe(s => this.onNavigateToUrl(s, false));
        this.navigate = this.createActionAndSubscribe(s => this.onNavigate(s));
        this.connect = this.createActionAndSubscribe(_ => this.onConnect());
        this.disconnect = this.createActionAndSubscribe(_ => this.onDisconnect());

        if(!this.options.doNotAutoConnect)
        {
            this.connect.trigger(null);
        }
    }

    /**
     * @inheritDoc
     */
    public getHref(path: string): string
    {
        const href = this.options.mode === RouterMode.Hash ? `#${path}` : path;

        return href;
    }

    /**
     * @inheritDoc
     */
    public getUrl(path: string): URL
    {
        return new URL(this.clearDoubleSlashes(this.options.locator.location.origin + this.options.root + path));
    }

    private onConnect(): void 
    {
        this.listenToUrlChanges();

        this.setState({ ...this.state, isConnected: true });
    }

    private onDisconnect(): void
    {
        window.clearInterval(this.interval);
        this.interval = null;

        this.setState({ ...this.state, isConnected: false });
    }

    private onNavigateToPath(path: string, replaceHistoryEntry: boolean): void
    {
        path = path ? path : "";

        if (this.options.mode === RouterMode.History)
        {
            const targetUrl = this.clearDoubleSlashes(this.options.root + path);
            if (replaceHistoryEntry === false)
            {
                this.options.locator.pushHistoryState(null, null, targetUrl);
            }
            else
            {
                const state = { replaced: this.state.currentHit.url.toString() };
                this.options.locator.replaceHistoryState(state, null, targetUrl);
            }
        }
        else
        {
            const newHref = this.options.locator.location.href.replace(/#(.*)$/, "") + "#" + path;
            this.options.locator.location = new URL(newHref);
        }

        this.applyCurrentRouteHit();
    }

    private onNavigateToUrl(url: URL, replaceHistoryEntry: boolean): void
    {
        let path = url.pathname + url.search + url.hash;

        path = path.replace(this.options.root, "/");

        this.onNavigateToPath(path, replaceHistoryEntry);
    }

    private onNavigate(params: INavigateActionParams): void
    {
        if (params.url)
        {
            let url = params.url as any;
            if (!url.protocol)
            {
                url = new URL(url);
            }
            this.onNavigateToUrl(url, params.replaceHistoryEntry);
        }
        else if (params.path)
        {
            this.onNavigateToPath(params.path, params.replaceHistoryEntry);
        }
        else
        {
            throw new Error(`The navigate action in the router store requires either the url or path to be set.`);
        }
    }

    private applyCurrentRouteHit(): void
    {
        if (this.currentFragemt !== this.getFragment())
        {
            this.currentFragemt = this.getFragment();

            const currentRouteHit = this.getRouteHit(this.currentFragemt, this.options.locator.location.href);
            this.setState({ ...this.state, currentHit: currentRouteHit });
        }
    }

    private listenToUrlChanges(): void
    {
        this.applyCurrentRouteHit();

        window.clearInterval(this.interval);
        this.interval = window.setInterval(() => this.applyCurrentRouteHit(), 50);
    }

    private clearDoubleSlashes(path: string): string
    {
        return path.toString().replace(/\/\//, "/");
    }

    private clearEndSlashes(path: string): string
    {
        return path.toString().replace(/\/$/, "")
                              .replace(/\/\?/, "")
                              .replace(/\#\?/, "");
    }

    /**
     * Get the route for the given fragment or the currently set fragment in the url.
     * @param fragment The fragment for which the route should be determined.
     * @returns The first matching route or null.
     */
    private getRouteHit(fragment: string, url: string): IRouteHit | null
    {
        fragment = fragment || this.getFragment();

        for (const route of this.options.routes)
        {
            const matchResult = this.options.routeMatchStrategy.matchUrl(
                fragment,
                this.clearEndSlashes(route.expression));

            if (matchResult.isMatch === true)
            {
                const routeHit: IRouteHit = {
                    route,
                    url: new URL(url),
                    parameters: matchResult.parameters
                };

                return routeHit;
            }
        }

        return null;
    }

    /**
     * Get the current fragment that must be evaluated against the routes.
     */
    private getFragment(): string
    {
        let fragment = "";
        const location = this.options.locator.location;
        if (this.options.mode === RouterMode.History)
        {
            fragment = this.clearDoubleSlashes(decodeURI(location.pathname + location.search + location.hash));
            // fragment = fragment.replace(/\?(.*)$/, "");
            fragment = this.options.root !== "/" ? fragment.replace(this.options.root, "") : fragment;
        }
        else
        {
            const match = location.href.match(/#(.*)$/);
            fragment = match ? match[1] : "";
        }

        return this.clearDoubleSlashes(fragment);
    }
}

applyMixins(RouterStore, [NeedToKnowAboutReplayMixin]);

/**
 * The router store may only exist once per browser window.
 * Therefore we make it singleton like this.
 */
export let routerStore: IRouterStore = null;

export function configureRouterStore(options: IRouterStoreOptions)
{
    if (routerStore)
    {
        throw new Error("The function configureRouterStore was called twice. ");
    }

    routerStore = new RouterStore(options);
}

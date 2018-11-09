import * as Rfluxx from "rfluxx";
import { IAction, IInjectedStoreOptions } from "rfluxx";

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
    parameters: Map<string, string>;
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
export class RouterStore extends Rfluxx.Store<IRouterStoreState>
{
    /**
     * @inheritDoc
     */
    public navigateToPath: IAction<string>;

    /**
     * @inheritDoc
     */
    public navigateToUrl: IAction<URL>;

    /**
     * Interval number used to listen to url changes periodically.
     */
    private interval: number = null;

    constructor(private options: IRouterStoreOptions)
    {
        super({
            initialState: {
                currentHit: null
            }
        });

        const historyModeChosen: boolean = this.options.mode !== undefined;

        if (!historyModeChosen)
        {
            this.options.mode = (historyModeChosen && !!(history.pushState)) ? RouterMode.History : RouterMode.Hash;
        }
        this.options.root = this.options.root !== undefined
                                ? "/" + this.clearSlashes(options.root) + "/"
                                : window.location.pathname;

        console.info("root for router store is " + this.options.root);

        this.navigateToPath = this.createActionAndSubscribe(s => this.onNavigateToPath(s));
        this.navigateToUrl = this.createActionAndSubscribe(s => this.onNavigateToUrl(s));

        this.listenToUrlChanges();
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
        return new URL(window.location.origin + this.options.root + this.clearSlashes(path));
    }

    private onNavigateToPath(path: string): void
    {
        path = path ? path : "";

        if (this.options.mode === RouterMode.History)
        {
            history.pushState(null, null, this.options.root + this.clearSlashes(path));
        }
        else
        {
            window.location.href = window.location.href.replace(/#(.*)$/, "") + "#" + path;
        }
    }

    private onNavigateToUrl(url: URL): void
    {
        let path = url.pathname + url.search + url.hash;

        path = path.replace(this.options.root, "/");

        this.onNavigateToPath(path);
    }

    private listenToUrlChanges(): void
    {
        let current = null;

        const applyCurrentRouteHit = () =>
        {
            if (current !== this.getFragment())
            {
                current = this.getFragment();

                const currentRouteHit = this.getRouteHit(current, window.location.href);
                this.setState({ currentHit: currentRouteHit });
            }
        };

        applyCurrentRouteHit();

        window.clearInterval(this.interval);
        this.interval = window.setInterval(applyCurrentRouteHit, 50);
    }

    private clearSlashes(path: string): string
    {
        return path.toString().replace(/\/$/, "").replace(/^\//, "");
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
            const paramRegex = new RegExp(route.expression, "i");
            const match: RegExpMatchArray = fragment.match(paramRegex);

            if (match)
            {
                let routeParams: Map<string, string> =  new Map<string, string>();
                if ((match as any).groups)
                {
                    routeParams = new Map<string, string>(Object.entries((match as any).groups));
                }

                const routeHit: IRouteHit = {
                    route,
                    url: new URL(url),
                    parameters: routeParams
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
        if (this.options.mode === RouterMode.History)
        {
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, "");
            fragment = this.options.root !== "/" ? fragment.replace(this.options.root, "") : fragment;
        }
        else
        {
            const match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : "";
        }

        return this.clearSlashes(fragment);
    }
}

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

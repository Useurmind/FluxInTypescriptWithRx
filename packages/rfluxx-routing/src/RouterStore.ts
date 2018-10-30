import * as Rfluxx from "rfluxx";
import { IRouterHandler, IRoute } from './Router';
import { IInjectedStoreOptions, IAction } from "rfluxx";

/**
 * Interface for a route that can be entered.
 */
export interface IRoute
{
    /**
     * An expression that is used to check if the route matches the url.
     * Can also contain named group, e.g. (?<name>regex) that can be used to capture 
     * values for parameters of the route.
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
    navigateTo: IAction<string>;

    /**
     * Get the href that can be applied to links from a path segment.
     * @param path The path segment. The href can differ from this segment for e.g. hash routing.
     */
    getHref(path: string): string;
}

/**
 * This store listens to changes of the url and signals the match for the currently active route.
 */
export class RouterStore extends Rfluxx.Store<IRouterStoreState>
{
    /**
     * Interval number used to listen to url changes periodically.
     */
    private interval: number = null;

    /**
     * @inheritDoc
     */
    public navigateTo: IAction<string>;

    constructor(private options: IRouterStoreOptions)
    {
        super({
            initialState: {
                currentHit: null
            }
        });

        const historyModeChosen: boolean = this.options.mode !== undefined;

        if(!historyModeChosen)
        {
            this.options.mode = (historyModeChosen && !!(history.pushState)) ? RouterMode.History : RouterMode.Hash;
        }
        this.options.root = this.options.root !== undefined ? '/' + this.clearSlashes(options.root) + '/' : '/';

        this.navigateTo = this.createActionAndSubscribe<string>(this.navigateToImpl);
    }

    /**
     * @inheritDoc
     */
    public getHref(path: string): string
    {
        const href = this.options.mode == RouterMode.Hash ? `#${path}` : path;

        return href;
    }

    private navigateToImpl(path: string): void
    {
        path = path ? path : '';
        if (this.options.mode === RouterMode.History)
        {
            history.pushState(null, null, this.options.root + this.clearSlashes(path));
        }
        else
        {
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        }
    }

    private listenToUrlChanges(): void
    {
        var current = null;

        var applyCurrentRouteHit = () =>
        {
            if (current !== this.getFragment())
            {
                current = this.getFragment();

                const currentRouteHit = this.getRouteHit(current);
                this.setState({ currentHit: currentRouteHit });
            }
        }

        applyCurrentRouteHit();

        window.clearInterval(this.interval);
        this.interval = window.setInterval(applyCurrentRouteHit, 50);
    }

    private clearSlashes(path: string): string
    {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }

    /**
     * Get the route for the given fragment or the currently set fragment in the url.
     * @param fragment The fragment for which the route should be determined.
     * @returns The first matching route or null.
     */
    private getRouteHit(fragment: string): IRouteHit | null
    {
        fragment = fragment || this.getFragment();
        for (var i = 0; i < this.options.routes.length; i++)
        {
            const route = this.options.routes[i];

            const paramRegex = new RegExp(route.expression, "i");
            const match: RegExpMatchArray = fragment.match(paramRegex);
            let routeParams = new Map(Object.entries((match as any).groups));
            if(!routeParams) {
                routeParams = new Map();
            }

            if(match)
            {
                return (<IRouteHit>{
                    route,
                    parameters: routeParams
                });
            }
        }

        return null;
    }

    /**
     * Get the current fragment that must be evaluated against the routes.
     */
    private getFragment(): string
    {
        let fragment = '';
        if (this.options.mode === RouterMode.History)
        {
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this.options.root !== '/' ? fragment.replace(this.options.root, '') : fragment;
        }
        else
        {
            var match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : '';
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
    if(routerStore)
    {
        throw "The function configureRouterStore was called twice. ";
    }

    routerStore = new RouterStore(options);
}
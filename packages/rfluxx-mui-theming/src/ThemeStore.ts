import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";
import { IRouterStore, IRouterStoreState } from "rfluxx-routing";
import { take } from "rxjs/operators";

/**
 * The state of the store { @see ThemeStore }.
 */
export interface IThemeStoreState
{
    /**
     * A string value set by the example action @setString.
     */
    activeTheme: string;

    /**
     * The themes that are available for choosing.
     */
    availableThemes: string[];
}

/**
 * The options to configure the store { @see ThemeStore }.
 */
export interface IThemeStoreOptions
    extends IInjectedStoreOptions
{
    /**
     * The themes that should be choosable.
     * First theme is the default theme.
     */
    availableThemes: string[];

    /**
     * The router store to which the resource store will connect for
     * setting the theme in the url.
     */
    routerStore: IRouterStore;

    /**
     * The name of the url search parameter that will be used to store the theme name.
     * By default this is "theme".
     */
    themeParameterName?: string;
}

/**
 * The interface that exposes the commands of the store { @see ThemeStore }.
 */
export interface IThemeStore extends IStore<IThemeStoreState>
{
    /**
     * Set the theme.
     */
    setTheme: IAction<string>;
}

/**
 * Store that manages the active theme.
 */
export class ThemeStore
    extends Store<IThemeStoreState> implements IThemeStore
{
    /**
     * @inheritdoc
     */
    public readonly setTheme: IAction<string>;

    private readonly themeParamName: string;

    constructor(private options: IThemeStoreOptions)
    {
        super({
            initialState: {
                activeTheme: options.availableThemes[0],
                availableThemes: options.availableThemes
            }
        });

        this.themeParamName = this.options.themeParameterName ? this.options.themeParameterName : "theme";

        this.setTheme = this.createActionAndSubscribe(x => this.onSetTheme(x));

        const lastRouterStoreState = this.options.routerStore.observe();
        lastRouterStoreState.subscribe(routerStoreState =>
        {
            const currentTheme = this.state.activeTheme;
            const currentRouteTheme = routerStoreState.currentHit.parameters.get(this.themeParamName);

            if (!currentRouteTheme)
            {
                this.applyThemeToRoute(routerStoreState);
            }
            else if (currentTheme.toLowerCase() !== currentRouteTheme.toLowerCase())
            {
                this.setTheme.trigger(currentRouteTheme);
            }
        });
    }

    private onSetTheme(theme: string)
    {
        this.setState({
            ...this.state,
            activeTheme: theme
        });

        this.options.routerStore.observe().pipe(take(1)).subscribe(x => this.applyThemeToRoute(x));
    }

    private applyThemeToRoute(routerStoreState: IRouterStoreState)
    {
        const currentTheme = this.state.activeTheme;
        const currentRouteTheme = routerStoreState.currentHit.parameters.get(this.themeParamName);

        if (!currentRouteTheme || currentTheme.toLowerCase() !== currentRouteTheme.toLowerCase())
        {
            const currentUrl = new URL(routerStoreState.currentHit.url.href);

            currentUrl.searchParams.set(this.themeParamName, currentTheme);

            this.options.routerStore.navigate.trigger({
                url: currentUrl,
                replaceHistoryEntry: true
            });
        }
    }
}

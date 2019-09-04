import { IAction, IInjectedStoreOptions, IStore, Store } from "rfluxx";
import { RouteParameters, IRouterStoreState, IRouterStore } from "rfluxx-routing";
import { combineLatest, take } from "rxjs/operators";
import { Observable } from "rxjs";

/**
 * A language that can be chosen.
 */
export interface ILanguage<TResourceTexts>
{
    /**
     * A key that identifies the language uniquely.
     */
    key: string;

    /**
     * A caption that can be shown for the language.
     */
    caption: string;

    /**
     * The resources in form of multi level dictionaries/objects.
     */
    resources: TResourceTexts;
}

/**
 * The state of the store { @see ResourceStore }.
 */
export interface IResourceStoreState<TResourceTexts>
{
    /**
     * The languages that can be shown.
     */
    availableLanguages: ILanguage<TResourceTexts>[];

    /**
     * The resources from the active language as multi level dictionary.
     */
    activeResources: TResourceTexts;

    /**
     * The language that is currently active.
     */
    activeLanguage: ILanguage<TResourceTexts>;
}

/**
 * The options to configure the store { @see ResourceStore }.
 */
export interface IResourceStoreOptions<TResourceTexts>
    extends IInjectedStoreOptions
{
    /**
     * The languages that should be available.
     */
    languages: ILanguage<TResourceTexts>[];

    routerStore: IRouterStore;
}

/**
 * The interface that exposes the commands of the store { @see ResourceStore }.
 */
export interface IResourceStore<TResourceTexts> extends IStore<IResourceStoreState<TResourceTexts>>
{
    /**
     * Set the language by handing its key.
     */
    setLanguage: IAction<string>;
}

/**
 * Store that manages resources.
 */
export class ResourceStore<TResourceTexts>
    extends Store<IResourceStoreState<TResourceTexts>> implements IResourceStore<TResourceTexts>
{
    public readonly setLanguage: IAction<string>;

    constructor(private options: IResourceStoreOptions<TResourceTexts>)
    {
        super({
            initialState: {
                availableLanguages: options.languages,
                activeLanguage: options.languages[0],
                activeResources: options.languages[0].resources
            }
        });

        this.setLanguage = this.createActionAndSubscribe(langKey => this.onSetLanguage(langKey));

        const lastRouterStoreState = this.options.routerStore.observe();
        lastRouterStoreState.subscribe(routerStoreState =>
        {
            const currentLanguage = this.state.activeLanguage.key;
            const currentRouteLanguage = routerStoreState.currentHit.parameters.get("lang");

            if (!currentRouteLanguage)
            {
                this.applyLanguageToRoute(routerStoreState);
            }
            else if (currentLanguage.toLowerCase() !== currentRouteLanguage.toLowerCase())
            {
                this.setLanguage.trigger(currentRouteLanguage);
            }
        });
    }

    private onSetLanguage(langKey: string): void
    {
        const activeLanguage = this.state.availableLanguages.find(x => x.key === langKey);
        this.setState({
            ...this.state,
            activeLanguage,
            activeResources: activeLanguage.resources
        });

        this.options.routerStore.observe().pipe(take(1)).subscribe(x => this.applyLanguageToRoute(x));
    }

    private applyLanguageToRoute(routerStoreState: IRouterStoreState)
    {
        const currentLanguage = this.state.activeLanguage.key;
        const currentRouteLanguage = routerStoreState.currentHit.parameters.get("lang");

        if (!currentRouteLanguage || currentLanguage.toLowerCase() !== currentRouteLanguage.toLowerCase())
        {
            const currentUrl = new URL(routerStoreState.currentHit.url.href);

            currentUrl.searchParams.set("lang", currentLanguage);

            this.options.routerStore.navigate.trigger({
                url: currentUrl,
                replaceHistoryEntry: true
            });
        }
    }
}

import * as Rfluxx from "rfluxx";
import { IAction, IInjectedStoreOptions } from "rfluxx";

import { IPageContainerFactory } from "./IPageContainerFactory";
import { ISiteMapNode, ISiteMapNodeHit, ISiteMapStore } from "./SiteMapStore";
import { IRouterStore } from './RouterStore';

/**
 * The state of a single page.
 */
export interface IPageState
{
    /**
     * The container managing the stores for the page.
     */
    container: Rfluxx.IContainer;
}

/**
 * A page represents the UI for a single site map node.
 */
export interface IPage
{
    /**
     * The site map node implemented by this page.
     */
    siteMapNode: ISiteMapNode;

    /**
     * The state of a single page.
     */
    state: IPageState;

    /**
     * The url fragment of the page.
     */
    urlFragment: string;

    /**
     * Is the page currently being edited.
     * Editing blocks eviction of the page state.
     */
    isInEditMode: boolean;

    /**
     * The route parameters extracted from the url fragment.
     */
    routeParameters: Map<string, string>;
}

/**
 * The options to configure the { @see PageManagementStore }
 */
export interface IPageManagementStoreOptions extends IInjectedStoreOptions
{
    /**
     * The router store.
     */
    routerStore: IRouterStore;

    /**
     * The site map store that dictates which site map node
     * should be active.
     */
    siteMapStore: ISiteMapStore;

    /**
     * The container factory to create a container for a page.
     */
    containerFactory: IPageContainerFactory;
}

/**
 * The state of the { @see PageManagementStore }
 */
export interface IPageManagementStoreState
{
    /**
     * This is the page that is currently active.
     */
    currentPage: IPage;
}

/**
 * Arguments for the setEditMode action of the { @see PageManagementStore }
 */
export interface ISetEditModeArguments
{
    /**
     * The id of the page for which to set the edit mode.
     * The id of a page is its url fragment.
     */
    pageId: string;

    /**
     * A bool flag that indicates whether the page is edited.
     */
    isInEditMode: boolean;
}

/**
 * Interface to interact with the { @see PageManagementStore }.
 */
export interface IPageManagementStore extends Rfluxx.IStore<IPageManagementStoreState>
{
    /**
     * Action to set the edit mode for a page.
     */
    setEditMode: IAction<ISetEditModeArguments>;

    /**
     * Action to close a page.
     * Parameters:
     * - pageId/urlFragment
     */
    close: IAction<string>;
}

/**
 * This store manages the state of open pages.
 */
export class PageManagementStore
    extends Rfluxx.Store<IPageManagementStoreState>
    implements IPageManagementStore
{
    /**
     * @inheritDoc
     */
    public setEditMode: IAction<ISetEditModeArguments>;

    /**
     * @inheritDoc
     */
    public close: IAction<string>;

    private siteMapNodeHit: IAction<ISiteMapNodeHit>;

    /**
     * The map of open pages keyed by their url fragment, usually each url
     * (independent of the route) should have its own state.
     */
    private pageMap: Map<string, IPage>;

    constructor(private options: IPageManagementStoreOptions)
    {
        super({
            initialState: {
                currentPage: null
            }
        });

        this.pageMap = new Map<string, IPage>();

        this.siteMapNodeHit = this.createActionAndSubscribe(x => this.onSiteMapNodeHit(x));

        this.setEditMode = this.createActionAndSubscribe(x => this.onSetEditMode(x));
        this.close = this.createActionAndSubscribe(x => this.onClose(x));

        this.options.siteMapStore.subscribe(s => this.siteMapNodeHit.trigger(s.siteMapNodeHit));
    }

    private onSetEditMode(params: ISetEditModeArguments): void
    {
        // setting the edit mode should block the page management store
        // from deleting the state of the page
        const page = this.pageMap.get(params.pageId);
        page.isInEditMode = params.isInEditMode;
    }

    private onClose(pageId: string): void
    {
        // when closing a page we just delete its state here
        // closing a page also ignores if it is in edit mode
        // TODO: allow to show a dialog to the user here
        this.pageMap.delete(pageId);
    }

    private onSiteMapNodeHit(siteMapNodeHit: ISiteMapNodeHit): void
    {
        if (siteMapNodeHit === null)
        {
            this.setState({ currentPage: null });
            return;
        }

        const urlFragment = siteMapNodeHit.urlFragment;

        if (!this.pageMap.has(urlFragment))
        {
            this.pageMap.set(urlFragment, {
                siteMapNode: siteMapNodeHit.siteMapNode,
                state: {
                    container: this.options.containerFactory.createContainer(
                        siteMapNodeHit.urlFragment,
                        siteMapNodeHit.parameters,
                        {
                            routerStore: this.options.routerStore,
                            siteMapStore: this.options.siteMapStore,
                            pageManagementStore: this
                        })
                },
                urlFragment: siteMapNodeHit.urlFragment,
                isInEditMode: false,
                routeParameters: siteMapNodeHit.parameters
            });
        }

        const page = this.pageMap.get(urlFragment);
        this.setState({ currentPage: page });
    }
}

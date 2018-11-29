import * as Rfluxx from "rfluxx";
import { IAction, IInjectedStoreOptions } from "rfluxx";

import { IPageContainerFactory } from "./IPageContainerFactory";
import { IPageCommunicationStore, IPageRequest, IPageResponse, PageCommunicationStore } from "./PageCommunicationStore";
import { IPageData } from "./Pages/IPageData";
import { IPageEvictionStrategy } from "./Pages/IPageEvictionStrategy";
import { IPageIdAlgorithm } from "./Pages/IPageIdAlgorithm";
import { IRouterStore } from "./RouterStore";
import { ISiteMapNode, ISiteMapNodeHit, ISiteMapStore } from "./SiteMapStore";

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

    /**
     * The algorithm used to compute the page id which in turn determines
     * which parts of a url lead to distinctive state aka. different pages.
     */
    pageIdAlgorithm: IPageIdAlgorithm;

    /**
     * This strategy determines how the state of the pages is evicted over time.
     */
    pageEvictionStrategy: IPageEvictionStrategy;
}

/**
 * The state of the { @see PageManagementStore }
 */
export interface IPageManagementStoreState
{
    /**
     * This is the page that is currently active.
     */
    currentPage: IPageData;
}

/**
 * Arguments for the setEditMode action of the { @see PageManagementStore }
 */
export interface ISetEditModeArguments
{
    /**
     * The url of the page for which to set the edit mode.
     */
    pageUrl: URL;

    /**
     * A bool flag that indicates whether the page is edited.
     */
    isInEditMode: boolean;
}

/**
 * Arguments for the action that opens a page.
 */
export interface IOpenPageArguments
{
    /**
     * The page request to open the page.
     */
    pageRequest: IPageRequest;
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
     * Gets the page url.
     */
    closePage: IAction<URL>;

    /**
     * Action to open a page.
     */
    openPage: IAction<IPageRequest>;
}

/**
 * This store manages the state of open pages.
 * TODO: implement LRU cache
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
    public closePage: IAction<URL>;

    /**
     * @inheritDoc
     */
    public openPage: IAction<IPageRequest>;

    public pageCommunicationStore: IPageCommunicationStore;

    private siteMapNodeHit: IAction<ISiteMapNodeHit>;

    /**
     * The map of open pages keyed by their url fragment, usually each url
     * (independent of the route) should have its own state.
     */
    private pageMap: Map<string, IPageData>;

    /**
     * A map of page requests keyed by the href of their url.
     * Used to include the page request into dependency injection for communication
     * between pages.
     */
    private pendingRequests: Map<string, IPageRequest>;

    constructor(private options: IPageManagementStoreOptions)
    {
        super({
            initialState: {
                currentPage: null
            }
        });

        // TODO: somehow we must avoid the circle of creating the stores
        // sadly communication between and management of pages are
        // tightly interwoven (open for suggestions here)
        this.pageCommunicationStore = new PageCommunicationStore({
            pageManagementStore: this,
            routerStore: this.options.routerStore,
            fetcher: options.fetcher,
            actionFactory: options.actionFactory
        });
        this.pageMap = new Map<string, IPageData>();
        this.pendingRequests = new Map<string, IPageRequest>();

        this.siteMapNodeHit = this.createActionAndSubscribe(x => this.onSiteMapNodeHit(x));

        this.setEditMode = this.createActionAndSubscribe(x => this.onSetEditMode(x));
        this.closePage = this.createActionAndSubscribe(x => this.onClosePage(x));
        this.openPage = this.createActionAndSubscribe(x => this.onOpenPage(x));

        this.options.siteMapStore.subscribe(s => this.siteMapNodeHit.trigger(s.siteMapNodeHit));
    }

    private onSetEditMode(params: ISetEditModeArguments): void
    {
        // setting the edit mode should block the page management store
        // from deleting the state of the page
        const pageId = this.options.pageIdAlgorithm.getPageId(params.pageUrl);
        const page = this.pageMap.get(pageId);
        page.isInEditMode = params.isInEditMode;
    }

    private onClosePage(pageUrl: URL): void
    {
        // when closing a page we just delete its state here
        // closing a page also ignores if it is in edit mode
        // TODO: allow to show a dialog to the user here
        const pageId = this.options.pageIdAlgorithm.getPageId(pageUrl);
        this.pageMap.delete(pageId);
    }

    private onOpenPage(pageRequest: IPageRequest): void
    {
        // save a pending request and route to page
        this.pendingRequests.set(pageRequest.url.href, pageRequest);
        this.options.routerStore.navigateToUrl.trigger(pageRequest.url);
    }

    private onSiteMapNodeHit(siteMapNodeHit: ISiteMapNodeHit): void
    {
        if (siteMapNodeHit === null)
        {
            this.setState({ currentPage: null });
            return;
        }

        const url = siteMapNodeHit.url;
        const pageId = this.options.pageIdAlgorithm.getPageId(url);

        const pendingRequest = this.pendingRequests.get(siteMapNodeHit.url.href);
        let hasPageState = this.pageMap.has(pageId);
        if (hasPageState && pendingRequest)
        {
            // if we have a pending request and state we want to override the state as the page is reopened
            console.warn("Page state is thrown away on page request of page " + siteMapNodeHit.url.href);
            hasPageState = false;
            this.pendingRequests.delete(siteMapNodeHit.url.href);
        }

        if (!hasPageState)
        {
            this.pageMap.set(pageId, {
                siteMapNode: siteMapNodeHit.siteMapNode,
                container: this.options.containerFactory.createContainer(
                    siteMapNodeHit.url,
                    siteMapNodeHit.parameters,
                    {
                        routerStore: this.options.routerStore,
                        siteMapStore: this.options.siteMapStore,
                        pageManagementStore: this,
                        pageCommunicationStore: this.pageCommunicationStore
                    },
                    pendingRequest),
                url: siteMapNodeHit.url,
                isInEditMode: false,
                routeParameters: siteMapNodeHit.parameters,
                pageRequest: pendingRequest
            });
        }

        const page = this.pageMap.get(pageId);

        const evictedPages = this.options
                                 .pageEvictionStrategy
                                 .getEvictionsOnSiteMapNodeHit(siteMapNodeHit, this.pageMap);
        for (const evictedPageId of evictedPages)
        {
            this.pageMap.delete(evictedPageId);
        }

        this.setState({ currentPage: page });
    }
}

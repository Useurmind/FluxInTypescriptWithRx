import * as Rfluxx from "rfluxx";
import { applyMixins, IAction, IActionEventLogPreserver, IInjectedStoreOptions, NeedToKnowAboutReplayMixin } from "rfluxx";

import { IPageContainerFactory } from "./DependencyInjection/IPageContainerFactory";
import { IPageCommunicationStore, IPageRequest, IPageResponse, PageCommunicationStore } from "./PageCommunication";
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

    /**
     * A list of pages that do have state at the moment.
     */
    openPages: IPageData[];
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
    implements IPageManagementStore, NeedToKnowAboutReplayMixin
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
    public readonly setEditMode: IAction<ISetEditModeArguments>;

    /**
     * @inheritDoc
     */
    public readonly closePage: IAction<URL>;

    /**
     * @inheritDoc
     */
    public readonly openPage: IAction<IPageRequest>;

    private pageCommunicationStore: IPageCommunicationStore;

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
                currentPage: null,
                openPages: []
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
        if (this.isReplaying)
        {
            return;
        }

        // setting the edit mode should block the page management store
        // from deleting the state of the page
        const pageId = this.options.pageIdAlgorithm.getPageId(params.pageUrl);
        const page = this.getPageOrThrow(pageId);
        page.isInEditMode = params.isInEditMode;
    }

    private onClosePage(pageUrl: URL): void
    {
        if (this.isReplaying)
        {
            return;
        }

        // when closing a page we just delete its state here
        // closing a page also ignores if it is in edit mode
        // TODO: allow to show a dialog to the user here
        const pageId = this.options.pageIdAlgorithm.getPageId(pageUrl);
        const page = this.getPageOrThrow(pageId);

        if (page.pageRequest)
        {
            // if the page was requested we should remove the open request
            // from the origin page
            const originId = this.options.pageIdAlgorithm.getPageId(page.pageRequest.origin);
            const origin = this.tryGetPage(originId);
            if (origin)
            {
                // TODO: think about what the correct handling of this case would be
                // the origin could be non existent when we return to page opened via page
                // communication and the origin is not yet created
                origin.openRequests.delete(pageId);
            }

            // TODO: also when a page was requested and then closed
            // the user should not be able to navigate back to it
            // as the "unit of work" was already finished, what to do here?
        }

        // close all requested pages as well
        // TODO: decide whether this is a good idea
        if (page.openRequests.size > 0)
        {
            for (const request of Array.from(page.openRequests.values()))
            {
                this.closePage.trigger(request.target);
            }
        }

        this.evictPage(pageId, page);

        this.setState({
            ...this.state,
            openPages: Array.from(this.pageMap.values())
        });
    }

    private onOpenPage(pageRequest: IPageRequest): void
    {
        if (this.isReplaying)
        {
            return;
        }

        // save a pending request and route to page
        this.pendingRequests.set(pageRequest.target.href, pageRequest);

        // add the request as open request to the requesting page
        const originId = this.options.pageIdAlgorithm.getPageId(pageRequest.origin);
        const targetId = this.options.pageIdAlgorithm.getPageId(pageRequest.target);
        const origin = this.getPageOrThrow(originId);
        // we can just overwrite here because this conforms with adding new state
        // for a repeatedly requested page
        origin.openRequests.set(targetId, pageRequest);

        this.options.routerStore.navigateToUrl.trigger(pageRequest.target);
    }

    private onSiteMapNodeHit(siteMapNodeHit: ISiteMapNodeHit): void
    {
        if (this.isReplaying)
        {
            return;
        }

        if (siteMapNodeHit === null)
        {
            this.setState({
                ...this.state,
                 currentPage: null
            });
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
        }
        this.pendingRequests.delete(siteMapNodeHit.url.href);

        let openPages = this.state.openPages;
        if (!hasPageState)
        {
            // when the sitemap node specifies an own container factory we
            // will use it instead of the central one
            const containerFactory = siteMapNodeHit.siteMapNode.containerFactory
                                        ? siteMapNodeHit.siteMapNode.containerFactory
                                        : this.options.containerFactory;

            this.pageMap.set(pageId, {
                pageId,
                siteMapNode: siteMapNodeHit.siteMapNode,
                container: containerFactory.createContainer(
                    pageId,
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
                pageRequest: pendingRequest,
                openRequests: new Map()
            });
            openPages = Array.from(this.pageMap.values());
        }

        const page = this.getPageOrThrow(pageId);

        const evictedPages = this.options
                                 .pageEvictionStrategy
                                 .getEvictionsOnSiteMapNodeHit(siteMapNodeHit, this.pageMap);
        for (const evictedPageId of evictedPages)
        {
            const evictedPage = this.tryGetPage(evictedPageId);
            this.evictPage(evictedPageId, evictedPage);
        }

        this.setState({
            ...this.state,
            currentPage: page,
            openPages
        });
    }

    private getPageOrThrow(pageId: string): IPageData
    {
        const page = this.pageMap.get(pageId);
        if (!page)
        {
            throw new Error(`Could not find page ${pageId}`);
        }

        return page;
    }

    private tryGetPage(pageId: string): IPageData
    {
        return this.pageMap.get(pageId);
    }

    private evictPage(pageId: string, page: IPageData): void
    {
        if (page)
        {
            const eventLogPreserver = page.container
                                          .resolveOptional<IActionEventLogPreserver>("IActionEventLogPreserver");
            if (eventLogPreserver)
            {
                eventLogPreserver.clearPersistedEvents();
            }
        }

        this.options.pageEvictionStrategy.onPageClosed(pageId);
        this.pageMap.delete(pageId);
    }
}

applyMixins(PageManagementStore, [NeedToKnowAboutReplayMixin]);

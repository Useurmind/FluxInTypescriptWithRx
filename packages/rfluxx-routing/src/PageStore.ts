import { Observable } from "rxjs/Observable";

import * as Rfluxx from "rfluxx";
import { IAction, IInjectedStoreOptions } from "rfluxx";

import { IPageContainerFactory } from "./DependencyInjection/IPageContainerFactory";
import { IPageCommunicationStore, IPageRequest, IPageResponse, IRequestedPageStore, PageCommunicationStore, PageResultStatus } from "./PageCommunication";
import { IPageManagementStore } from "./PageManagementStore";
import { IPageIdAlgorithm } from "./Pages/IPageIdAlgorithm";
import { IRouterStore } from "./Routing/RouterStore";
import { ISiteMapNode, ISiteMapNodeHit, ISiteMapStore } from "./SiteMap";

/**
 * The options to configure the { @see PageStore }
 */
export interface IPageStoreOptions extends IInjectedStoreOptions
{
    /**
     * The urlof the page that this store works on.
     */
    pageUrl: URL;

    /**
     * The store used to communicate with other pages.
     */
    pageCommunicationStore: IPageCommunicationStore;

    /**
     * Store that manages pages.
     */
    pageManagementStore: IPageManagementStore;

    /**
     * The router store used to navigate between pages.
     */
    routerStore: IRouterStore;
}

/**
 * The state of the { @see PageStore }
 */
export interface IPageStoreState
{
    /**
     * This is the url of the page this store is for.
     */
    pageUrl: URL;

    /**
     * The page request by which this page was opened.
     */
    pageRequest: IPageRequest | null;
}

/**
 * Interface to interact with the { @see PageStore }.
 */
export interface IPageStore extends Rfluxx.IStore<IPageStoreState>, IRequestedPageStore
{
    /**
     * Action to turn on/off the edit mode for this page (true = editing, false = read only).
     */
    setEditMode: IAction<boolean>;

    /**
     * Action to complete this page (indicate success).
     * The argument to this action can be the result of the page.
     * If the page was requested the result will be forwarded to the requesting page.
     * Else it will be ignored.
     */
    complete: IAction<any>;

    /**
     * Action to cancel this page.
     * The argument to this action can be the result of the page.
     * If the page was requested the result will be forwarded to the requesting page.
     * Else it will be ignored.
     */
    cancel: IAction<any>;

    /**
     * Action to fail this page.
     * The argument to this action can be the error of the page.
     * If the page was requested the error will be forwarded to the requesting page.
     * Else it will be ignored.
     */
    fail: IAction<any>;

    /**
     * This function is only sending a request to a page (and not expecting a result).
     * @param urlFragment The url fragment for the requested page withouth origin (protocol and host/port),
     *                    starting from path.
     * @param data The input data for the requested page.
     */
    requestPage(urlFragment: string, data: any): void;

    /**
     * This function sends request to another page. Afterwards you can subscribe the result of the requested page.
     * @param urlFragment The url fragment for the requested page withouth origin (protocol and host/port),
     *                    starting from path.
     * @param data The input data for the requested page.
     * @returns An observable that can be subscribed to handle the response or any error.
     *          In case of completion the response is returned in the next handler.
     *          In case of cancelation the only complete handler is invoked, no response is returned.
     *          In case of error a response is returned in the error handler.
     */
    requestPageWithResult(urlFragment: string, data: any): Observable<IPageResponse>;
}

/**
 * This store is meant to be used inside a page for easy access to the most important
 * central services regarding a page, e.g.
 * - page communication
 * - state management, e.g. closing the page
 */
export class PageStore
    extends Rfluxx.Store<IPageStoreState>
    implements IPageStore
{
    /**
     * @inheritDoc
     */
    public setPageRequest: IAction<IPageRequest>;

    /**
     * @inheritDoc
     */
    public setEditMode: IAction<boolean>;

    /**
     * @inheritDoc
     */
    public complete: IAction<any>;

    /**
     * @inheritDoc
     */
    public cancel: IAction<any>;

    /**
     * @inheritDoc
     */
    public fail: IAction<any>;

    constructor(private options: IPageStoreOptions)
    {
        super({
            ...options,
            initialState: {
                pageUrl: options.pageUrl,
                pageRequest: null
            }
        });

        this.setPageRequest = this.createActionAndSubscribe(x => this.onSetPageRequest(x));
        this.setEditMode = this.createActionAndSubscribe(x => this.onSetEditMode(x));
        this.complete = this.createActionAndSubscribe(x => this.onClosePage(x, PageResultStatus.Completed));
        this.cancel = this.createActionAndSubscribe(x => this.onClosePage(x, PageResultStatus.Canceled));
        this.fail = this.createActionAndSubscribe(x => this.onClosePage(x, PageResultStatus.Error));
    }

    /**
     * @inheritDoc
     */
    public requestPage(urlFragment: string, data: any): void
    {
        this.options.pageCommunicationStore.requestPage(this.options.pageUrl, urlFragment, data);
    }

    /**
     * @inheritDoc
     */
    public requestPageWithResult(urlFragment: string, data: any): Observable<IPageResponse>
    {
        return this.options.pageCommunicationStore.requestPageWithResult(this.options.pageUrl, urlFragment, data);
    }

    private onSetPageRequest(pageRequest: IPageRequest): void
    {
        this.setState({
            ...this.state,
            pageRequest
        });
    }

    private onSetEditMode(params: boolean): void
    {
        this.options.pageManagementStore.setEditMode.trigger({
            pageUrl: this.state.pageUrl,
            isInEditMode: params
        });
    }

    private onClosePage(result: any, pageStatus: PageResultStatus): void
    {
        if (this.state.pageRequest)
        {
            this.options.pageCommunicationStore.respond.trigger({
                request: this.state.pageRequest,
                data: result,
                status: pageStatus
            });
        }

        this.options.pageManagementStore.closePage.trigger(this.state.pageUrl);

        if (this.state.pageRequest)
        {
            // we replace the history entry so that the user
            // can not navigate back to the page
            this.options.routerStore.navigate.trigger({
                url: this.state.pageRequest.origin,
                replaceHistoryEntry: true
            });
        }
    }

}

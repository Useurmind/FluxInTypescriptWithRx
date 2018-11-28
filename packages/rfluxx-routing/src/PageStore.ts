import * as Rx from "rxjs";

import * as Rfluxx from "rfluxx";
import { IAction, IInjectedStoreOptions } from "rfluxx";

import { IPageContainerFactory } from "./IPageContainerFactory";
import { IPageCommunicationStore, IPageRequest, IPageResponse, PageCommunicationStore, PageResultStatus } from "./PageCommunicationStore";
import { IPage, IPageManagementStore } from "./PageManagementStore";
import { IPageIdAlgorithm } from "./Pages/IPageIdAlgorithm";
import { IRouterStore } from "./RouterStore";
import { ISiteMapNode, ISiteMapNodeHit, ISiteMapStore } from "./SiteMapStore";

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
     * The request that lead to this page being openend.
     * Can be not set.
     */
    pageRequest: IPageRequest | null;

    /**
     * The store used to communicate with other pages.
     */
    pageCommunicationStore: IPageCommunicationStore;

    /**
     * Store that manages pages.
     */
    pageManagementStore: IPageManagementStore;
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
}

/**
 * Interface to interact with the { @see PageStore }.
 */
export interface IPageStore extends Rfluxx.IStore<IPageStoreState>
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
    requestPageWithResult(urlFragment: string, data: any): Rx.Observable<IPageResponse>;
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
            initialState: {
                pageUrl: options.pageUrl
            }
        });

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
        this.options.pageCommunicationStore.requestPage(urlFragment, data);
    }

    /**
     * @inheritDoc
     */
    public requestPageWithResult(urlFragment: string, data: any): Rx.Observable<IPageResponse>
    {
        return this.options.pageCommunicationStore.requestPageWithResult(urlFragment, data);
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
        if (this.options.pageRequest)
        {
            this.options.pageCommunicationStore.respond.trigger({
                request: this.options.pageRequest,
                data: result,
                status: pageStatus
            });
        }

        this.options.pageManagementStore.closePage.trigger(this.state.pageUrl);
    }

}

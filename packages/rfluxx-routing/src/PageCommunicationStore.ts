import * as Rfluxx from "rfluxx";
import { IAction, IInjectedStoreOptions } from "rfluxx";
import * as Rx from "rxjs";

import { IPageManagementStore } from "./PageManagementStore";
import { IRouterStore } from "./RouterStore";

/**
 * Result status for a page.
 */
export enum PageResultStatus
{
    /**
     * The page completed succesfully (with a result).
     */
    Completed,

    /**
     * The page was canceled (nothing should change).
     */
    Canceled,

    /**
     * The page produced an error.
     */
    Error
}

/**
 * Interface for requesting to open a page.
 */
export interface IPageRequest
{
    /**
     * The url of the page to request.
     */
    url: URL;

    /**
     * Data that should be handed to the requested page.
     * Both requesting page and responding page must be aware
     * of the correct data transported here.
     */
    pageInput: any | null;
}

export interface IPageResponse
{
    /**
     * The request from which the response results.
     * The request object stays the same so you can compare with ===
     * for the correct response to a request.
     */
    request: IPageRequest;

    /**
     * Data that should be handed to the requesting page after
     * the requested page was commited.
     * Both requesting page and responding page must be aware
     * of the correct data transported here.
     * The page result can be null!
     */
    pageResult: any | null;

    /**
     * The result status of the requested page.
     */
    status: PageResultStatus;
}

/**
 * The options to configure the { @see PageCommunicationStore }
 */
export interface IPageCommunicationStoreOptions extends IInjectedStoreOptions
{
    /**
     * The page management store.
     */
    pageManagementStore: IPageManagementStore;

    /**
     * The router store.
     */
    routerStore: IRouterStore;
}

/**
 * The state of the { @see PageCommunicationStore }
 * It will deliver the responses to the different requests.
 * You need to filter out your response based on the request object which is the same.
 * in the response.
 */
export interface IPageCommunicationStoreState
{
    /**
     * The next response.
     */
    response: IPageResponse;
}

/**
 * Interface to interact with the { @see PageCommunicationStore }.
 */
export interface IPageCommunicationStore extends Rfluxx.IStore<IPageCommunicationStoreState>
{
    /**
     * Start a page request.
     * Before doing this you need to subscribe the state of the store.
     * Else it could be that you miss your response.
     */
    requestPage: IAction<IPageRequest>;

    /**
     * Send a response when closing a page.
     */
    respond: IAction<IPageResponse>;

    /**
     * This function is for easier use of only sending a request to a page (and not expecting a result).
     * @param pageCommunicationStore The page communication store to use.
     * @param urlPath The url for the requested page withouth origin (protocol and host/port), starting from path.
     * @param pageInput The input data for the requested page.
     */
    sendToPage(urlPath: string, pageInput: any): void;

    /**
     * This function encapsulates the complete request process for another page.
     * @param pageCommunicationStore The page communication store to use.
     * @param urlPath The url for the requested page withouth origin (protocol and host/port), starting from path.
     * @param pageInput The input data for the requested page.
     * @returns An observable that can be subscribed to handle the response or any error.
     *          In case of completion the response is returned in the next handler.
     *          In case of cancelation the only complete handler is invoked, no response is returned.
     *          In case of error a response is returned in the error handler.
     */
    requestPageWithResult(urlPath: string, pageInput: any): Rx.Observable<IPageResponse>;
}

/**
 * This store allows communication between different pages.
 * Pages can be opened in response to a navigation via url change, or through a page request.
 * You do not need to use this store when just navigating. Only use this if you really need to
 * transport data between pages.
 * We see pages as unit of works. You give them some input (always optional, e.g. when just navigating)
 * and they return some output (only when a page request is available).
 */
export class PageCommunicationStore
    extends Rfluxx.Store<IPageCommunicationStoreState>
    implements IPageCommunicationStore
{
    /**
     * @inheritDoc
     */
    public requestPage: IAction<IPageRequest>;

    /**
     * @inheritDoc
     */
    public respond: IAction<IPageResponse>;

    constructor(private options: IPageCommunicationStoreOptions)
    {
        super({
            initialState: {
                response: null
            }
        });

        this.requestPage = this.createActionAndSubscribe(x => this.onRequestPage(x));
        this.respond = this.createActionAndSubscribe(x => this.onRespond(x));
    }

    /**
     * @inheritDoc
     */
    public sendToPage(urlPath: string, pageInput: any): void
    {
        const url = this.options.routerStore.getUrl(urlPath);

        const request = {
            url,
            pageInput
        };
        this.requestPage.trigger(request);
    }

    /**
     * @inheritDoc
     */
    public requestPageWithResult(urlPath: string, pageInput: any): Rx.Observable<IPageResponse>
    {
        const url = this.options.routerStore.getUrl(urlPath);

        return Rx.Observable.create((observer: Rx.Observer<IPageResponse>) =>
        {
            // create a trackable request
            const request = {
                url,
                pageInput
            };

            // subscribe the response
            this.subscribe(
                    state =>
                    {
                        // the request object stays the same between calls
                        // so we can compare it like this
                        if (state.response.request === request)
                        {
                            switch (state.response.status)
                            {
                                case PageResultStatus.Completed:
                                    // in case of completion we return a response
                                    observer.next(state.response);
                                    observer.complete();
                                    break;
                                case PageResultStatus.Canceled:
                                    // in case the page was canceled we just complete the request
                                    observer.complete();
                                    break;
                                case PageResultStatus.Error:
                                    // in case of error we return the response as error
                                    observer.error(state.response);
                                    observer.complete();
                                    break;
                                default:
                                    throw new Error(`Unkown page response status ${state.response.status}`);
                            }
                        }
                    });

            // trigger the request
            this.requestPage.trigger(request);
        });
    }

    private onRequestPage(pageRequest: IPageRequest): void
    {
        this.options.pageManagementStore.openPage.trigger(pageRequest);
    }

    private onRespond(pageResponse: IPageResponse): void
    {
        // when responding we at the same time close the page
        // TODO: is this a good idea or does this conflict with other requirements?
        this.options.pageManagementStore.closePage.trigger(pageResponse.request.url);
        this.setState({ ...this.state, response: pageResponse });
    }
}

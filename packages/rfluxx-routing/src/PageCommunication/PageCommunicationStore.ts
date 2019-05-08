import * as Rfluxx from "rfluxx";
import { applyMixins, IAction, IInjectedStoreOptions, INeedToKnowAboutReplay, NeedToKnowAboutReplayMixin } from "rfluxx";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

import { IPageManagementStore } from "../PageManagementStore";
import { IRouterStore } from "../Routing/RouterStore";

import { IPageRequest } from "./IPageRequest";
import { IPageResponse } from "./IPageResponse";
import { PageResultStatus } from "./PageResultStatus";

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
    request: IAction<IPageRequest>;

    /**
     * Send a response when closing a page.
     */
    respond: IAction<IPageResponse>;

    /**
     * This function is for easier use of only sending a request to a page (and not expecting a result).
     * @param origin The url of the page that creates the request.
     * @param targetUrlFragment The url for the requested page withouth origin (protocol and host/port),
     *                          starting from path.
     * @param pageInput The input data for the requested page.
     */
    requestPage(origin: URL, targetUrlFragment: string, pageInput: any): void;

    /**
     * This function encapsulates the complete request process for another page.
     * @param origin The url of the page that creates the request.
     * @param targetUrlFragment The url for the requested page withouth origin (protocol and host/port),
     *                          starting from path.
     * @param pageInput The input data for the requested page.
     * @returns An observable that can be subscribed to handle the response or any error.
     *          In case of completion the response is returned in the next handler.
     *          In case of cancelation the only complete handler is invoked, no response is returned.
     *          In case of error a response is returned in the error handler.
     */
    requestPageWithResult(origin: URL, targetUrlFragment: string, pageInput: any): Observable<IPageResponse>;
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
    implements IPageCommunicationStore, NeedToKnowAboutReplayMixin
{
    /**
     * @inheritDoc
     */
    public respond: IAction<IPageResponse>;

    /**
     * @inheritDoc
     */
    public request: IAction<IPageRequest>;

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

    constructor(private options: IPageCommunicationStoreOptions)
    {
        super({
            initialState: {
                response: null
            }
        });

        this.request = this.createActionAndSubscribe(x => this.onRequest(x));
        this.respond = this.createActionAndSubscribe(x => this.onRespond(x));
    }

    /**
     * @inheritDoc
     */
    public requestPage(origin: URL, targetUrlFragment: string, data: any): void
    {
        const target = this.options.routerStore.getUrl(targetUrlFragment);

        const request = {
            origin,
            target,
            data
        };
        this.request.trigger(request);
    }

    /**
     * @inheritDoc
     */
    public requestPageWithResult(origin: URL, targetUrlFragment: string, data: any): Observable<IPageResponse>
    {
        const target = this.options.routerStore.getUrl(targetUrlFragment);

        return Observable.create((observer: Observer<IPageResponse>) =>
        {
            // create a trackable request
            const request = {
                origin,
                target,
                data
            };

            // subscribe the response
            this.subscribe(
                    state =>
                    {
                        // the request object stays the same between calls
                        // so we can compare it like this
                        if (state && state.response && state.response.request === request)
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
            this.request.trigger(request);
        });
    }

    private onRequest(pageRequest: IPageRequest): void
    {
        if (!this.isReplaying)
        {
            this.options.pageManagementStore.openPage.trigger(pageRequest);
        }
    }

    private onRespond(pageResponse: IPageResponse): void
    {
        if (!this.isReplaying)
        {
            // we only close in the PageStore, then we have the flexibility to decide what to do
            // when calling this stores respond method
            // this.options.pageManagementStore.closePage.trigger(pageResponse.request.url);
            this.setState({ ...this.state, response: pageResponse });
        }
    }
}

applyMixins(PageCommunicationStore, [NeedToKnowAboutReplayMixin]);

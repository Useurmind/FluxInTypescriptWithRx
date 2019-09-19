import { IContainer, IContainerBuilder, registerStore, registerTimeTraveler, SimpleContainerBuilder, TimeTraveler } from "rfluxx";

import { IPageRequest, IRequestedPageStore, isIRequestedPageStore, IPageCommunicationStore } from "../PageCommunication";
import { PageStore } from "../PageStore";
import { RouteParameters, IRouterStore } from "../Routing/RouterStore";

import { IGlobalComponents } from "./IGlobalComponents";
import { IPageAwareContainerBuilder } from "./IPageAwareContainerBuilder";
import { ISiteMapNodeContainerFactory } from "./ISiteMapNodeContainerFactory";
import { ISiteMapNode } from '../SiteMap';
import { ISiteMapNodeContainerBuilder } from './SiteMapNodeContainerBuilder';
import { IPageManagementStore } from '../PageManagementStore';
import { IGlobalContainerBuilder } from './GlobalContainerBuilder';
import { IGlobalContainerFactory } from './IGlobalContainerFactory';

export function registerBasePageServices(
    builder: ISiteMapNodeContainerBuilder,
    pageId: string,
    url: URL,
    routeParameters: RouteParameters,
    pageRequest?: IPageRequest | null): void
{
    builder.register(c => routeParameters)
           .as("RouteParameters");

    registerStore(builder, "IPageStore", (c, injOpt) => new PageStore(injOpt({
        pageUrl: url,
        pageCommunicationStore: c.resolve<IPageCommunicationStore>("IPageCommunicationStore"),
        pageManagementStore: c.resolve<IPageManagementStore>("IPageManagementStore"),
        routerStore: c.resolve<IRouterStore>("IRouterStore")
    })));

    builder.register(c => pageRequest).as("IPageRequest");
    builder.register(c => url).as("PageUrl");
    builder.register(c => pageId).as("PageId");
}

export function initAfterContainerCreation(container: IContainer)
{
    container.resolveOptional<TimeTraveler>("TimeTraveler");

    const pageRequest = container.resolveOptional<IPageRequest>("IPageRequest");

    // if there is a page request, set it on all stores implementing IRequestedPageStore
    if (pageRequest)
    {
        const allStores = container.resolve<IRequestedPageStore[]>("IStore[]");
        for (const store of allStores)
        {
            if (isIRequestedPageStore(store))
            {
                store.setPageRequest.trigger(pageRequest);
            }
        }
    }
}

/**
 * A base class for a page factory that already includes functionality like
 * - registering global stores (IRouterStore, ISiteMapStore, IPageManagementStore)
 *
 * Uses { @see SimpleContainer } for dependency injection and resolution.
 */
export abstract class SiteMapNodeContainerFactoryBase implements ISiteMapNodeContainerFactory {

    /**
     * @inheritDoc
     */
    public register(builder: ISiteMapNodeContainerBuilder)
        : void
    {
        // time travel is currently not working with routing
        // even if we would have to register it globally i think
        // registerTimeTraveler(builder, true, pageId);
        //registerTimeTraveler(builder, true, null);

        this.registerStores(builder);
    }

    /**
     * Implement this method to register your own stores.
     * @param container The container in which you can register your stores.
     * @param url The url of the page for which the container is created.
     * @param routeParamters The parameters that were extracted from the route.
     */
    protected abstract registerStores(builder: ISiteMapNodeContainerBuilder): void;
}

import { IContainer, IContainerBuilder, registerStore, registerTimeTraveler, SimpleContainerBuilder, TimeTraveler } from "rfluxx";

import { IPageRequest, IRequestedPageStore, isIRequestedPageStore } from "../PageCommunication";
import { PageStore } from "../PageStore";

import { IGlobalComponents } from "./IGlobalComponents";
import { IPageContainerFactory } from "./IPageContainerFactory";

/**
 * A base class for a page factory that already includes functionality like
 * - registering global stores (IRouterStore, ISiteMapStore, IPageManagementStore)
 *
 * Uses { @see SimpleContainer } for dependency injection and resolution.
 */
export abstract class SimplePageContainerFactoryBase implements IPageContainerFactory {

    /**
     * @inheritDoc
     */
    public createContainer(
        pageId: string,
        url: URL,
        routeParameters: Map<string, string>,
        globalComponents: IGlobalComponents,
        pageRequest?: IPageRequest | null)
        : IContainer
    {
        const builder = new SimpleContainerBuilder();

        // registerTimeTraveler(builder, true, pageId);
        registerTimeTraveler(builder, true, null);

        builder.register(c => routeParameters)
               .as("RouteParameters");

        builder.register(c => globalComponents.routerStore)
            .as("IRouterStore")
            .in("INeedToKnowAboutReplay[]");
        builder.register(c => globalComponents.siteMapStore)
            .as("ISiteMapStore");

        builder.register(c => globalComponents.pageManagementStore)
            .as("IPageManagementStore")
            .in("INeedToKnowAboutReplay[]");

        builder.register(c => globalComponents.pageCommunicationStore)
            .as("IPageCommunicationStore")
            .in("INeedToKnowAboutReplay[]");

        registerStore(builder, "IPageStore", (c, injOpt) => new PageStore(injOpt({
            pageUrl: url,
            pageCommunicationStore: globalComponents.pageCommunicationStore,
            pageManagementStore: globalComponents.pageManagementStore,
            routerStore: globalComponents.routerStore
        })));

        builder.register(c => pageRequest).as("IPageRequest");
        builder.register(c => url).as("PageUrl");

        this.registerStores(builder, url, routeParameters);

        const container = builder.build();

        container.resolve<TimeTraveler>("TimeTraveler");

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

        return container;
    }

    /**
     * Implement this method to register your own stores.
     * @param container The container in which you can register your stores.
     * @param url The url of the page for which the container is created.
     * @param routeParamters The parameters that were extracted from the route.
     */
    protected abstract registerStores(builder: IContainerBuilder, url: URL, routeParameters: Map<string, string>);
}

import { IContainer, registerStore, registerTimeTraveler, SimpleContainerBuilder, TimeTraveler, IContainerBuilder } from "rfluxx";

import { IPageCommunicationStore, IPageRequest } from "./PageCommunicationStore";
import { IPageManagementStore } from "./PageManagementStore";
import { PageStore } from "./PageStore";
import { IRouterStore } from "./RouterStore";
import { ISiteMapStore } from "./SiteMapStore";

/**
 * Data object to hold the stores that are globally unique in the
 * routing library.
 */
export interface IGlobalComponents
{
    /**
     * The router store that watches the window location for changes.
     */
    routerStore: IRouterStore;

    /**
     * The site map store that determines the current site map node.
     */
    siteMapStore: ISiteMapStore;

    /**
     * The page management store that manages the state for the active pages.
     */
    pageManagementStore: IPageManagementStore;

    /**
     * The store that allows for communication between pages.
     */
    pageCommunicationStore: IPageCommunicationStore;
}

/**
 * The container factory is used to create a container for a page.
 * You need to provide an implementation for this so that the { @see PageManagementStore}
 * can create a new container for each new page it hits.
 */
export interface IPageContainerFactory
{
    /**
     * Create a new container.
     * The container should contain the following registrations:
     * - IRouterStore
     * - ISiteMapStore
     * - IPageManagementStore
     * - IPageCommunicationStore
     * - IPageStore: The store that can be used by the page to get easy access to central services.
     * - IPageRequest: The request that lead to the page opening, optional can be null|undefined.
     * - PageUrl: The url (of type URL) that was called for the page to open.
     * @param pageId The page id uniquely identifies the page for which the container is created (computed from the url)
     * @param url The url of the page for which the container is created.
     * @param routeParamters The parameters that were extracted from the route.
     * @param globalComponents The global stores provided by the framework.
     * @param pageRequest The request that leads to the page. Can be null for pages to which was just navigated.
     * @returns The new container.
     */
    createContainer(
        pageId: string,
        url: URL,
        routeParameters: Map<string, string>,
        globalComponents: IGlobalComponents,
        pageRequest?: IPageRequest)
        : IContainer;
}

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

        registerTimeTraveler(builder, true, pageId);

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
            pageRequest,
            pageCommunicationStore: globalComponents.pageCommunicationStore,
            pageManagementStore: globalComponents.pageManagementStore,
            routerStore: globalComponents.routerStore
        })));

        builder.register(c => pageRequest).as("IPageRequest");
        builder.register(c => url).as("PageUrl");

        this.registerStores(builder, url, routeParameters);

        const container = builder.build();

        container.resolve<TimeTraveler>("TimeTraveler");

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

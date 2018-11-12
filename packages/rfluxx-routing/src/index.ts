import { IGlobalStores, IPageContainerFactory } from "./IPageContainerFactory";
import { PageManagementStore } from "./PageManagementStore";
import { configureRouterStore, RouterMode, RouterStore, routerStore } from "./RouterStore";
import { computeSiteMapRoutesAndSetAbsoluteRouteExpressions, ISiteMapNode, SiteMapStore } from "./SiteMapStore";

export function init(siteMap: ISiteMapNode, containerFactory: IPageContainerFactory)
    : IGlobalStores
{
    const routes = computeSiteMapRoutesAndSetAbsoluteRouteExpressions(siteMap);

    configureRouterStore({
        mode: RouterMode.History,
        routes
    });

    const siteMapStore = new SiteMapStore({
        routerStore,
        siteMap
    });

    const pageManagementStore = new PageManagementStore({
        routerStore,
        siteMapStore,
        containerFactory
    });

    return {
        routerStore,
        siteMapStore,
        pageManagementStore,
        pageCommunicationStore: pageManagementStore.pageCommunicationStore
    };
}

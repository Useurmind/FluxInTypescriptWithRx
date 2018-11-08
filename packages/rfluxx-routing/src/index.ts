import { IGlobalStores, IPageContainerFactory } from "./IPageContainerFactory";
import { PageManagementStore } from "./PageManagementStore";
import { configureRouterStore, RouterMode, RouterStore, routerStore } from "./RouterStore";
import { getSiteMapRoutes, ISiteMapNode, SiteMapStore } from "./SiteMapStore";

export function init(siteMap: ISiteMapNode, containerFactory: IPageContainerFactory)
    : IGlobalStores
{
    const routes = getSiteMapRoutes(siteMap);

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
        pageManagementStore
    };
}

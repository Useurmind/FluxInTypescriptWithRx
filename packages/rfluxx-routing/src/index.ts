import { IGlobalStores, IPageContainerFactory } from "./IPageContainerFactory";
import { PageManagementStore } from "./PageManagementStore";
import { NoPageStateEvictions } from "./Pages/NoPageStateEvictions";
import { IPathAndSearchPageIdOptions, PathAndSearchPageId } from "./Pages/PathAndSearchPageId";
import { RegexRouteMatching } from "./RouteMatching/RegexRouteMatching";
import { configureRouterStore, RouterMode, RouterStore, routerStore } from "./RouterStore";
import { computeSiteMapRoutesAndSetAbsoluteRouteExpressions, ISiteMapNode, SiteMapStore } from "./SiteMapStore";

/**
 * Options for the { @see init } function.
 */
export interface IRfluxxOptions
{
    /**
     * The site map to use for navigation.
     * The routing table is derived from this.
     */
    siteMap: ISiteMapNode;

    /**
     * Container factory that contains all registrations for
     * stores and other classes you need.
     */
    containerFactory: IPageContainerFactory;

    /**
     * Options to configure the page id computation.
     */
    pageIdOptions?: IPathAndSearchPageIdOptions;
}

/**
 * Initialize the rfluxx routing framework.
 * @param options Options to configure rfluxx routing framework.
 */
export function init(options: IRfluxxOptions)
    : IGlobalStores
{
    const pageIdAlgorithm = new PathAndSearchPageId(options.pageIdOptions);
    const pageEvictionStrategy = new NoPageStateEvictions();
    const routes = computeSiteMapRoutesAndSetAbsoluteRouteExpressions(options.siteMap);

    configureRouterStore({
        mode: RouterMode.History,
        routes,
        routeMatchStrategy: new RegexRouteMatching()
    });

    const siteMapStore = new SiteMapStore({
        routerStore,
        siteMap: options.siteMap
    });

    const pageManagementStore = new PageManagementStore({
        routerStore,
        siteMapStore,
        containerFactory: options.containerFactory,
        pageIdAlgorithm,
        pageEvictionStrategy
    });

    return {
        routerStore,
        siteMapStore,
        pageManagementStore,
        pageCommunicationStore: pageManagementStore.pageCommunicationStore
    };
}

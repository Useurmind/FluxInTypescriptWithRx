import { IGlobalComponents, IPageContainerFactory } from "./IPageContainerFactory";
import { PageManagementStore } from "./PageManagementStore";
import { NoPageStateEvictions } from "./Pages/NoPageStateEvictions";
import { IPathAndSearchPageIdOptions, PathAndSearchPageId } from "./Pages/PathAndSearchPageId";
import { ComplexRouteMatching } from "./RouteMatching/ComplexRouteMatching";
import { RegexRouteMatching } from "./RouteMatching/RegexRouteMatching";
import { configureRouterStore, RouterMode, RouterStore, routerStore } from "./RouterStore";
import { computeSiteMapRoutesAndSetAbsoluteRouteExpressions, ISiteMapNode, SiteMapStore } from "./SiteMapStore";
import { LruPageStateEvictions } from './Pages/LruPageStateEvictions';

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

    /**
     * If this number is specified the app will try to keep
     * only the target number of pages open and close all other pages.
     */
    targetNumberOpenPages?: number;

    /**
     * The part of the path in the url that is constant across the page.
     */
    rootPath?: string;
}

/**
 * Initialize the rfluxx routing framework.
 * @param options Options to configure rfluxx routing framework.
 */
export function init(options: IRfluxxOptions)
    : IGlobalComponents
{
    const pageIdAlgorithm = new PathAndSearchPageId(options.pageIdOptions);
    const pageEvictionStrategy = options.targetNumberOpenPages
                                 ? new LruPageStateEvictions({
                                     pageIdAlgorithm,
                                     targetNumberPagesInCache: options.targetNumberOpenPages
                                    })
                                 : new NoPageStateEvictions();
    const routes = computeSiteMapRoutesAndSetAbsoluteRouteExpressions(options.siteMap);

    configureRouterStore({
        mode: RouterMode.History,
        root: options.rootPath,
        routes,
        routeMatchStrategy: new ComplexRouteMatching()
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

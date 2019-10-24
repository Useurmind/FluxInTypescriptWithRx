import { IGlobalComponents, IPageAwareContainerBuilder, ISiteMapNodeContainerFactory } from "./DependencyInjection";
import { GlobalContainerBuilder } from "./DependencyInjection/GlobalContainerBuilder";
import { IGlobalContainerFactory } from "./DependencyInjection/IGlobalContainerFactory";
import { PageAwareContainerBuilder } from "./DependencyInjection/PageAwareContainerBuilder";
import { SiteMapNodeContainerBuilder } from "./DependencyInjection/SiteMapNodeContainerBuilder";
import { PageManagementStore } from "./PageManagementStore";
import { LruPageStateEvictions } from "./Pages/LruPageStateEvictions";
import { NoPageStateEvictions } from "./Pages/NoPageStateEvictions";
import { IPathAndSearchPageIdOptions, PathAndSearchPageId } from "./Pages/PathAndSearchPageId";
import { ComplexRouteMatching } from "./RouteMatching/ComplexRouteMatching";
import { RegexRouteMatching } from "./RouteMatching/RegexRouteMatching";
import { configureRouterStore, RouterMode, RouterStore, routerStore } from "./Routing/RouterStore";
import { ISiteMapNode } from "./SiteMap/ISiteMapNode";
import { computeSiteMapRoutesAndSetAbsoluteRouteExpressions, forEachSiteMapNode, SiteMapStore } from "./SiteMap/SiteMapStore";

export * from "./Components";
export * from "./DependencyInjection";
export * from "./PageCommunication";
export * from "./Pages";
export * from "./RouteMatching";

export * from "./CurrentPage";
export * from "./CurrentSiteMapNode";
export * from "./Page";
export * from "./PageContext";
export * from "./PageManagementStore";
export * from "./PageStore";
export * from "./Routing";
export * from "./SiteMap";

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
    containerFactory: IGlobalContainerFactory;

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
 * This is the result of the init function.
 */
export interface IRfluxxConfigurationResult extends IGlobalComponents
{
    /**
     * The container build that can be used to build containers.
     * It contains the registrations of all site map nodes as well as the global
     * container factory.
     */
    containerBuilder: IPageAwareContainerBuilder;
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
        routeMatchStrategy: new ComplexRouteMatching(),
        doNotAutoConnect: true
    });

    const containerBuilder = new PageAwareContainerBuilder();

    const siteMapStore = new SiteMapStore({
        routerStore,
        siteMap: options.siteMap
    });

    const pageManagementStore = new PageManagementStore({
        routerStore,
        siteMapStore,
        containerBuilder,
        pageIdAlgorithm,
        pageEvictionStrategy
    });

    const configurationResult: IRfluxxConfigurationResult = {
        routerStore,
        siteMapStore,
        pageManagementStore,
        pageCommunicationStore: pageManagementStore.pageCommunicationStore,
        containerBuilder
    };

    // init the app container builder
    options.containerFactory.register(new GlobalContainerBuilder(containerBuilder), configurationResult);
    forEachSiteMapNode(
        options.siteMap,
        (sn: ISiteMapNode, snPath, parentValue: string) =>
        {
            if (sn.containerFactory)
            {
                sn.containerFactory.register(new SiteMapNodeContainerBuilder(containerBuilder, sn));
            }
        });

    // connect only when container builder is complete
    routerStore.connect.trigger(null);

    return configurationResult;
}

import { IGlobalContainerBuilder } from "rfluxx-routing";
import { registerStore, injectStoreOptions, IInjectedStoreOptions } from "rfluxx";

import { DebugWindowStore, IDebugWindowStoreOptions } from "./DebugWindowStore";
import { RouteHitStore, IRouteHitStoreOptions } from './RouteHitStore';

/**
 * This function registers all required stores for the debug window 
 * in the container.
 *  - IDebugWindowStore
 *  - IRouteHitStore
 */
export function registerRfluxxDebug(builder: IGlobalContainerBuilder) {
    builder.register(c => DebugWindowStore(injectStoreOptions<IDebugWindowStoreOptions>(c, {
        routeHitStore: c.resolve("IRouteHitStore"),
    }))).as("IDebugWindowStore").shareGlobally();

    builder.register(c => RouteHitStore(injectStoreOptions<IRouteHitStoreOptions>(c, {
        routerStore: c.resolve("IRouterStore"),
    }))).as("IRouteHitStore").shareGlobally();
}
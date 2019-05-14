import { IGlobalContainerBuilder } from "./GlobalContainerBuilder";
import { IGlobalComponents } from "./IGlobalComponents";

/**
 * This type of container factory is used to register global services in the app container that are
 * available in all site map nodes.
 * You need to provide an implementation for this so that you can register your services
 * for inclusion into the container of all site map nodes.
 */
export interface IGlobalContainerFactory
{
    /**
     * Register necessary global services in the app container.
     * The container should contain at least the following registrations:
     * - IRouterStore
     * - ISiteMapStore
     * - IPageManagementStore
     * - IPageCommunicationStore
     */
    register(builder: IGlobalContainerBuilder, globalComponents: IGlobalComponents): void;
}

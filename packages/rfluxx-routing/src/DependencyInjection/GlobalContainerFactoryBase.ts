import { IGlobalContainerBuilder } from "./GlobalContainerBuilder";
import { IGlobalComponents } from "./IGlobalComponents";
import { IGlobalContainerFactory } from "./IGlobalContainerFactory";

/**
 * Global container factory that can be extended.
 */
export abstract class GlobalContainerFactoryBase implements IGlobalContainerFactory
{
    /**
     * @inheritdoc
     */
    public register(builder: IGlobalContainerBuilder, globalComponents: IGlobalComponents): void
    {
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

        this.registerStores(builder);
    }

    /**
     * Implement this method to register your globally available stores.
     * @param builder The builder to register the stores on.
     */
    protected abstract registerStores(builder: IGlobalContainerBuilder);
}

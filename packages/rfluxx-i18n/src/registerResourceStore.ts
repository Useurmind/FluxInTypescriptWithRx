import { IGlobalContainerBuilder, IRouterStore, ISiteMapNodeContainerBuilder } from "rfluxx-routing";
import { injectStoreOptions } from "rfluxx";

import { ResourceStore, ILanguage, IResourceStoreOptions } from "./ResourceStore";

/**
 * Register a resource management store globally for the given languages.
 * @param builder The container builder to register the resource store in.
 * @param languages The languages that contain the resources.
 */
export function registerResourcesGlobally<TResourceTexts>(builder: IGlobalContainerBuilder, languages: ILanguage<TResourceTexts>[])
{
    builder.register(c => {
        const options: IResourceStoreOptions<TResourceTexts> = {
            languages,
            routerStore: c.resolve<IRouterStore>("IRouterStore")
        };
        
        return new ResourceStore<TResourceTexts>(injectStoreOptions(c, options, "IResourceStore"));
    }).as("IResourceStore").shareGlobally();
}
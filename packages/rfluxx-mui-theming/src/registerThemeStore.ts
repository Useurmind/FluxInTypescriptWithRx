import { IGlobalContainerBuilder, IRouterStore, ISiteMapNodeContainerBuilder } from "rfluxx-routing";
import { injectStoreOptions } from "rfluxx";

import { ThemeStore, IThemeStoreOptions } from "./ThemeStore";

/**
 * Register a theme store globally for the given themes.
 * @param builder The container builder to register the theme store in.
 * @param themes The themes that are available.
 */
export function registerThemesGlobally(builder: IGlobalContainerBuilder, themes: string[])
{
    builder.register(c => {
        const options: IThemeStoreOptions = {
            availableThemes: themes,
            routerStore: c.resolve<IRouterStore>("IRouterStore")
        };
        
        return new ThemeStore(injectStoreOptions(c, options, "IThemeStore"));
    }).as("IThemeStore").shareGlobally();
}
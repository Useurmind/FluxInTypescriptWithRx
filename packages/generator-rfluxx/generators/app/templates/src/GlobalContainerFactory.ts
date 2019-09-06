import { IContainer, IContainerBuilder, registerStore, resolveStore } from "rfluxx";
<% if (includeTheming) { %>
import { registerThemesGlobally } from "rfluxx-mui-theming";
<% } %>
import { GlobalContainerFactoryBase, IGlobalComponents, IGlobalContainerBuilder, RouteParameters } from "rfluxx-routing";
<% if (includeInternationalization) { %>
import { registerResourcesGlobally } from "rfluxx-i18n";

import { languages } from "./i18n/Languages";
<% } %>

export class GlobalContainerFactory extends GlobalContainerFactoryBase
{
    protected registerStores(builder: IGlobalContainerBuilder): void
    {
        <% if (includeTheming) { %>
        registerThemesGlobally(builder, "Default");
        <% } %>

        <% if (includeInternationalization) { %>
        registerResourcesGlobally(builder, languages);
        <% } %>

        // register your global stores here
        // registerStore(builder, "IFormPageStore", (c, injOpt) => new FormPageStore(injOpt({
        //     pageStore: c.resolve("IPageStore")
        // })));
    }
}

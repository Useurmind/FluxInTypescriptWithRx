import { IContainer, IContainerBuilder, registerStore, resolveStore } from "rfluxx";

import { IGlobalComponents, IPageContainerFactory, RouteParameters, SimplePageContainerFactoryBase } from "rfluxx-routing";

import { SelectPageStore } from "./SelectPageStore";

export class ContainerFactory extends SimplePageContainerFactoryBase
{
    protected registerStores(builder: IContainerBuilder, url: URL, routeParameters: RouteParameters): void
    {
        registerStore(builder, "ISelectPageStore", (c, injOpt) => new SelectPageStore(injOpt({
            pageStore: c.resolve("IPageStore"),
            pageRequest: c.resolve("IPageRequest")
        })));
    }
}

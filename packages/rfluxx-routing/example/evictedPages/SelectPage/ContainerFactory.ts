import { IContainer, IContainerBuilder, registerStore, resolveStore } from "rfluxx";

import { IGlobalComponents, IPageContainerFactory, SimplePageContainerFactoryBase } from "../../../src/IPageContainerFactory";

import { SelectPageStore } from "./SelectPageStore";

export class ContainerFactory extends SimplePageContainerFactoryBase
{
    protected registerStores(builder: IContainerBuilder, url: URL, routeParameters: Map<string, string>): void
    {
        registerStore(builder, "ISelectPageStore", (c, injOpt) => new SelectPageStore(injOpt({
            pageStore: c.resolve("IPageStore"),
            pageRequest: c.resolve("IPageRequest")
        })));
    }
}

import { IContainer, registerStore, resolveStore, SimpleContainer } from "rfluxx";

import { IGlobalComponents, IPageContainerFactory, SimplePageContainerFactoryBase } from "../../../src/IPageContainerFactory";

import { SelectPageStore } from "./SelectPageStore";

export class ContainerFactory extends SimplePageContainerFactoryBase
{
    protected registerStores(container: SimpleContainer, url: URL, routeParameters: Map<string, string>): void
    {
        registerStore(container, "ISelectPageStore", (c, injOpt) => new SelectPageStore(injOpt({
            pageStore: c.resolve("IPageStore"),
            pageRequest: c.resolve("IPageRequest")
        })));
    }
}

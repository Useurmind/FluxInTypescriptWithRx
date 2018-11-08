import { IContainer, SimpleContainer } from "rfluxx";

import { IGlobalStores, IPageContainerFactory, SimplePageContainerFactoryBase } from "../../src/IPageContainerFactory";

import { CounterStore } from "./CounterStore";

export class ContainerFactory extends SimplePageContainerFactoryBase
{
    protected registerStores(container: SimpleContainer, url: URL, routeParameters: Map<string, string>): void
    {
        container.register("ICounterStore", c => new CounterStore());
    }
}

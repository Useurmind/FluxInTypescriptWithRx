import { IContainer, IContainerBuilder } from "rfluxx";

import { RouteParameters } from "../../src";
import { IGlobalComponents, IPageContainerFactory, SimplePageContainerFactoryBase } from "../../src/DependencyInjection";

import { CounterStore } from "./CounterStore";

export class ContainerFactory extends SimplePageContainerFactoryBase
{
    protected registerStores(builder: IContainerBuilder, url: URL, routeParameters: RouteParameters): void
    {
        builder.register(c => new CounterStore({
            pageStore: c.resolve("IPageStore"),
            pageRequest: c.resolve("IPageRequest")
        })).as("ICounterStore");
    }
}

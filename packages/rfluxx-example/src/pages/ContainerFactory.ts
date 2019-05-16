import { IContainer, IContainerBuilder } from "rfluxx";
import { IGlobalContainerBuilder, RouteParameters } from "rfluxx-routing";
import { GlobalContainerFactoryBase, IGlobalComponents, IPageContainerFactory } from "rfluxx-routing";

import { CounterStore } from "./CounterStore";

export class ContainerFactory extends GlobalContainerFactoryBase
{
    protected registerStores(builder: IGlobalContainerBuilder): void
    {
        builder.register(c => new CounterStore({
            pageStore: c.resolve("IPageStore"),
            pageRequest: c.resolve("IPageRequest")
        })).as("ICounterStore");
    }
}

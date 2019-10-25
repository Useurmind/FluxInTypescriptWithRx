import { IContainer, IContainerBuilder, registerStore, resolveStore } from "rfluxx";
import { ISiteMapNodeContainerBuilder, SiteMapNodeContainerFactoryBase } from "rfluxx-routing";

import { BoundPageStore } from "./BoundPageStore";

export class ContainerFactory extends SiteMapNodeContainerFactoryBase
{
    protected registerStores(builder: ISiteMapNodeContainerBuilder): void
    {
        registerStore(builder, "IBoundPageStore", (c, injOpt) => new BoundPageStore(injOpt({
        })));
    }
}

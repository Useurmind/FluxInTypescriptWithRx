import { IContainer, IContainerBuilder, registerStore, resolveStore } from "rfluxx";
import { GlobalContainerFactoryBase, IGlobalComponents, IGlobalContainerBuilder, RouteParameters } from "rfluxx-routing";

export class GlobalContainerFactory extends GlobalContainerFactoryBase
{
    protected registerStores(builder: IGlobalContainerBuilder): void
    {
        // register your global stores here
        // registerStore(builder, "IFormPageStore", (c, injOpt) => new FormPageStore(injOpt({
        //     pageStore: c.resolve("IPageStore")
        // })));
    }
}

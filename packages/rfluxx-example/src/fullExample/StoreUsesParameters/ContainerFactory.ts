import { IContainer, IContainerBuilder, PullingStore, registerStore, resolveStore } from "rfluxx";
import { IFormStorage, InMemoryFormStorage, IValidator, LocalFormStore } from "rfluxx-forms";
import { IGlobalComponents, ISiteMapNodeContainerBuilder, RouteParameters, SiteMapNodeContainerFactoryBase } from "rfluxx-routing";
import { UseParametersStore } from './UseParametersStore';

export class ContainerFactory extends SiteMapNodeContainerFactoryBase
{
    protected registerStores(builder: ISiteMapNodeContainerBuilder): void
    {
        registerStore(builder, "IUseParametersStore", (c, injOpt) => UseParametersStore(injOpt({
            routeParameters: c.resolve("RouteParametersStream")
        })));
    }
}

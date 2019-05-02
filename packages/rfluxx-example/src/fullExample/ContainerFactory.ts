import { IContainer, IContainerBuilder, registerStore, resolveStore } from "rfluxx";
import { IGlobalComponents, IPageContainerFactory, RouteParameters, SimplePageContainerFactoryBase } from "rfluxx-routing";

import { EditPageStore } from "./EditPage/EditPageStore";
import { EndlessSequencePageStore } from "./EndlessSequence/EndlessSequencePageStore";
import { FormPageStore } from "./FormWithSelectPage/FormPageStore";

export class ContainerFactory extends SimplePageContainerFactoryBase
{
    protected registerStores(builder: IContainerBuilder, url: URL, routeParameters: RouteParameters): void
    {
        registerStore(builder, "IFormPageStore", (c, injOpt) => new FormPageStore(injOpt({
            pageStore: c.resolve("IPageStore")
        })));

        registerStore(builder, "IEditPageStore", (c, injOpt) => new EditPageStore(injOpt({
            pageStore: c.resolve("IPageStore")
        })));

        registerStore(builder, "IEndlessSequencePageStore", (c, injOpt) => new EndlessSequencePageStore(injOpt({
            pageStore: c.resolve("IPageStore"),
            sequenceNumber: Number.parseInt(routeParameters.get("sequenceNumber"))
        })));
    }
}

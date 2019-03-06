import { IContainer, registerStore, resolveStore, SimpleContainer } from "rfluxx";

import { IGlobalComponents, IPageContainerFactory, SimplePageContainerFactoryBase } from "../../src/IPageContainerFactory";

import { EndlessSequencePageStore } from "./EndlessSequence/EndlessSequencePageStore";
import { FormPageStore } from "./FormWithSelectPage/FormPageStore";

export class ContainerFactory extends SimplePageContainerFactoryBase
{
    protected registerStores(container: SimpleContainer, url: URL, routeParameters: Map<string, string>): void
    {
        registerStore(container, "IFormPageStore", (c, injOpt) => new FormPageStore(injOpt({
            pageStore: c.resolve("IPageStore")
        })));

        registerStore(container, "IEndlessSequencePageStore", (c, injOpt) => new EndlessSequencePageStore(injOpt({
            pageStore: c.resolve("IPageStore"),
            sequenceNumber: Number.parseInt(routeParameters.get("sequenceNumber"))
        })));
    }
}

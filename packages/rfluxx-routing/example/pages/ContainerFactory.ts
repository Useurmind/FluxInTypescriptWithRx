import { IContainer, SimpleContainer } from "rfluxx";

import { IGlobalStores, IPageContainerFactory } from "../../src/IPageContainerFactory";

import { CounterStore } from "./CounterStore";

export class ContainerFactory implements IPageContainerFactory
{
    public createContainer(
        urlFragment: string,
        routeParameters: Map<string, string>,
        globalStores: IGlobalStores): IContainer
    {
        const container = new SimpleContainer();

        container.register("ICounterStore", c => new CounterStore());

        return container;
    }
}

import { IActionFactory, IContainer, IContainerBuilder, IInjectedStoreOptions, IStore } from "..";
import { PrefixActionFactory } from "../ActionFactory/PrefixActionFactory";
import { IObservableFetcher } from "../Fetch/IObservableFetcher";

import { IContainerRegistration } from "./IContainerRegistration";

/**
 * Register a store in the given container adding all the required interfaces that the store should
 * have to work with the event log and time travel.
 * @param container The container to add the store to.
 * @param typeName The name of the type of the store.
 * @param create A function that creates the store.
 * @param key A string key unique for this store in this container (for using a store type multiple times, optional).
 */
export function registerStore<TState>(
    containerBuilder: IContainerBuilder,
    typeName: string,
    create: (c: IContainer, injectStoreOptions: (o: any) => any) => IStore<TState>,
    key?: string): IContainerRegistration
{
    const storeKey = getStoreRegistrationKey(typeName, key);

    const injectedCreate = (c: IContainer) =>
    {
        const actionFactory = c.resolve<IActionFactory>("IActionFactory");
        const prefixedActionFactory = new PrefixActionFactory(actionFactory, storeKey);

        const injectStoreOptions = (o: IInjectedStoreOptions) => ({
            ...o,
            actionFactory: prefixedActionFactory,
            fetcher: c.resolve<IObservableFetcher>("IObservableFetcher")
        });

        return create(c, injectStoreOptions);
    };

    return containerBuilder.register(injectedCreate)
                           .as(storeKey)
                           .in("IResetMyState[]");
}

/**
 * Resolve a store from the given container.
 * @param container The container to resolve the store from.
 * @param typeName The type name (or interface name) or the store that should be resolved.
 * @param key A unique key for this store in this container (for multi instancing stores, optional).
 */
export function resolveStore<TState>(
    container: IContainer,
    typeName: string,
    key?: string)
{
    const storeKey = getStoreRegistrationKey(typeName, key);

    container.resolve<IStore<TState>>(storeKey);
}

function getStoreRegistrationKey(typeName: string, key?: string): string
{
    if (!key)
    {
        return typeName;
    }

    return `${typeName}.${key}`;
}

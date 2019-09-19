import { useEffect, useState } from "react";
import { IContainer, IStore, StoreSubscription } from "rfluxx";

import { useStoreState } from './useStoreState';

/**
 * Props interface for components that want to use the state of a store from a container.
 */
export interface IUseStoreFromContainerProps
{
    /**
     * The container to get the store from.
     * If null then the context container should be used.
     */
    container: IContainer;

    /**
     * The key by which the store is registered in the container.
     */
    storeRegistrationKey: string;

    /**
     * The name of the instance to resolve (for multi instancing).
     */
    storeInstanceName?: string;
}

/**
 * A react hook to retrieve the state from a store which is resolved from a container.
 * @param props The props to configure the hook.
 * @returns The state of the store.
 */
export function useStoreStateFromContainer<TStore extends IStore<TState>, TState>(props: IUseStoreFromContainerProps) : [TState, TStore]
{
    const store = props.container.resolve<TStore>(props.storeRegistrationKey, props.storeInstanceName);

    return [
        useStoreState(store),
        store
    ];
}
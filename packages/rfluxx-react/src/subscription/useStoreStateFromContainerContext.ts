import { useEffect, useState, useContext } from "react";
import { IContainer, IStore, StoreSubscription } from "rfluxx";

import { useStoreState } from './useStoreState';
import { ContainerContext } from '../context';

/**
 * Props interface for components that want to use the state of a store from a container from the @see ContainerContext.
 */
export interface IUseStoreFromContainerContextProps
{
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
 * A react hook to retrieve the state from a store which is resolved from a container which comes via the @see ContainerContext.
 * @param props The props to configure the hook.
 * @returns An array with the state of the store and the store.
 */
export function useStoreStateFromContainerContext<TStore extends IStore<TState>, TState>(props: IUseStoreFromContainerContextProps) : [TState, TStore]
{
    const container = useContext(ContainerContext);
    const store = container.resolve<TStore>(props.storeRegistrationKey, props.storeInstanceName);

    return [
        useStoreState(store),
        store
    ];
}
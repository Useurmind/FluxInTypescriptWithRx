import { StoreStateSubject, useStoreState } from "./StoreState";
import { IStore } from "..";

/**
 * Create a store and its state subject.
 * @param initialState The initial state of the store.
 * @returns The state subject, the state setter, and a core object for the store.
 */
export function useStore<TState>(initialState: TState): [StoreStateSubject<TState>, (TState) => void, IStore<TState>]
{    
    const [state, setState] = useStoreState<TState>(initialState);

    const store = useStoreCore<TState>(state, setState, initialState);

    return [state, setState, store];
}

/**
 * Create a core object for a store that fullfills the @see IStore interface.
 * @param state The state subject for the store.
 * @param setState A function to set the state of the store.
 * @param initialState The initial state of the store.
 * @returns A core object for a store.
 */
export function useStoreCore<TState>(
    state: StoreStateSubject<TState>,
    setState: (TState) => void,
    initialState: TState): IStore<TState>
{
    return {
        subscribe: x => state.subscribe(x),
        observe: () => state,
        resetState: () => setState(initialState),
    }
}
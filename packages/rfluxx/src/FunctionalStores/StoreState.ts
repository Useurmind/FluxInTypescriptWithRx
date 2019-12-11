import { BehaviorSubject } from "rxjs/BehaviorSubject";

/**
 * Simple type declaration for a subject used as store state container.
 */
export type StoreStateSubject<TState> = BehaviorSubject<TState>;

/**
 * This is a combination of state subject and state setter for a store.
 */
export type IStoreStateResult<TState> = [StoreStateSubject<TState>, (s: TState) => void];

/**
 * Create a store state for a store.
 * @param initialState The initial state of the store.
 * @returns An array of state subject and setter for the state.
 */
export function useStoreState<TState>(initialState: TState): IStoreStateResult<TState>
{
    const subject = new BehaviorSubject<TState>(initialState);

    return [
        subject,
        (state: TState) =>
        {
            if (state)
            {
                subject.next(state);
            }
        }
    ];
}
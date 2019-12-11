import { handleAction, handleActionVoid, IInjectedStoreOptions, IStore, reduceAction, useStore } from "rfluxx";

/**
 * The state of the store { @see MYStore }.
 */
export interface IMYStoreState
{
    /**
     * A string value set by the example action @setString.
     */
    someString: string;
}

/**
 * The options to configure the store { @see MYStore }.
 */
export interface IMYStoreOptions
    extends IInjectedStoreOptions
{
}

/**
 * The interface that exposes the commands of the store { @see MYStore }.
 */
export interface IMYStore extends IStore<IMYStoreState>
{
    /**
     * Example action that sets a string in the store state
     */
    setString(value: string);
}

/**
 * Store that .
 */
const MYStore = (options: IMYStoreOptions) => {
    const initialState = {
        someString: ""
    };
    const [state, setState, store] = useStore<IMYStoreState>(initialState);

    return {
        ...store,
        setSomeState: reduceAction(state, (s, someState: string) => ({ ...s, someState }))
    }
};

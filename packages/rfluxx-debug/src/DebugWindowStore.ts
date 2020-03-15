import { handleAction, handleActionVoid, IInjectedStoreOptions, IStore, reduceAction, useStore } from "rfluxx";

export enum DebugWindowTabs {
    RouteHits,
    Other
}

/**
 * The state of the store { @see DebugWindowStore }.
 */
export interface IDebugWindowStoreState
{
    /**
     * Indicates whether the debug window is open.
     */
    isOpen: boolean;

    /**
     * The currently selected window tab.
     */
    activeTab: DebugWindowTabs;
}

/**
 * The options to configure the store { @see DebugWindowStore }.
 */
export interface IDebugWindowStoreOptions
    extends IInjectedStoreOptions
{
}

/**
 * The interface that exposes the commands of the store { @see DebugWindowStore }.
 */
export interface IDebugWindowStore extends IStore<IDebugWindowStoreState>
{
    /**
     * Switch the isOpen flag.
     */
    toggleOpen();

    /**
     * Set the active tab in the debug window.
     * @param value The tab to select.
     */
    setActiveTab(value: DebugWindowTabs);
}

/**
 * Store that manages the debug window of the rfluxx tooling.
 */
export const DebugWindowStore = (options: IDebugWindowStoreOptions) => {
    const initialState = {
        isOpen: false,
        activeTab: DebugWindowTabs.RouteHits
    };
    const [state, setState, store] = useStore<IDebugWindowStoreState>(initialState);

    return {
        ...store,
        toggleOpen: reduceAction(state, (s) => ({ ...s, isOpen: !s.isOpen })),
        setActiveTab: reduceAction(state, (s, activeTab: DebugWindowTabs) => ({ ...s, activeTab }))
    }
};

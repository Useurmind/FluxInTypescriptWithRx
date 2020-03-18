import { handleAction, handleActionVoid, IInjectedStoreOptions, IStore, reduceAction, useStore } from "rfluxx";
import { IRouteHitStore } from './RouteHitStore';

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
     * States whether the window records events.
     */
    isRecording: boolean;

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
    /**
     * The store that manages the recorded route hits.
     */
    routeHitStore: IRouteHitStore;
}

/**
 * The interface that exposes the commands of the store { @see DebugWindowStore }.
 */
export interface IDebugWindowStore extends IStore<IDebugWindowStoreState>
{
    /**
     * Clear all data gathered until now.
     */
    clear();

    /**
     * Switch the isOpen flag.
     */
    toggleOpen();

    /**
     * Switch recording on or off.
     */
    toggleRecording();

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
        isRecording: false,
        activeTab: DebugWindowTabs.RouteHits
    };
    const [state, setState, store] = useStore<IDebugWindowStoreState>(initialState);

    return {
        ...store,
        clear: () => {
            options.routeHitStore.clear();
        },
        toggleOpen: reduceAction(state, (s) => ({ ...s, isOpen: !s.isOpen })),
        setActiveTab: reduceAction(state, (s, activeTab: DebugWindowTabs) => ({ ...s, activeTab })),
        toggleRecording: () => {
            setState({
                ...state.value,
                isRecording: !state.value.isRecording
            });

            options.routeHitStore.setRecording(state.value.isRecording);
        }
    }
};

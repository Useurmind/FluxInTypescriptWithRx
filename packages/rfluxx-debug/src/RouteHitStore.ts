import { handleAction, handleActionVoid, IInjectedStoreOptions, IStore, reduceAction, useStore } from "rfluxx";
import { IRouteHit, IRouterStore } from "rfluxx-routing";
import { distinctUntilChanged } from "rxjs/operators";

/**
 * Describes a route hit that happened.
 */
export interface IRouteHitEvent {
    /**
     * The time when the route hit was recorded.
     */
    time: Date;

    /**
     * The route hit published by the router store.
     */
    value: IRouteHit;
}

/**
 * The state of the store { @see RouteHitStore }.
 */
export interface IRouteHitStoreState
{
    /**
     * The route hits that were recorded.
     */
    routeHits: IRouteHitEvent[];

    /**
     * Indicates whether events should be recorded.
     */
    isRecording: boolean;
}

/**
 * The options to configure the store { @see RouteHitStore }.
 */
export interface IRouteHitStoreOptions
    extends IInjectedStoreOptions
{
    /**
     * The router store from which to gather the route hits.
     */
    routerStore: IRouterStore;
}

/**
 * The interface that exposes the commands of the store { @see RouteHitStore }.
 */
export interface IRouteHitStore extends IStore<IRouteHitStoreState>
{
    /**
     * Clear all recorded route hits.
     */
    clear();

    /**
     * Set recording active/inactive
     */
    setRecording(value: boolean);
}

/**
 * Store that manages the route hits to show in the debug window.
 */
export const RouteHitStore = (options: IRouteHitStoreOptions) => {
    const initialState = {
        routeHits: [],
        isRecording: false,
    };
    const [state, setState, store] = useStore<IRouteHitStoreState>(initialState);

    const addRouteHit = reduceAction(state, (s, routeHit: IRouteHit) => ({
        ...s,
        routeHits: [...s.routeHits, {
            time: new Date(Date.now()),
            value: routeHit,
        }]
    }));

    const clear = reduceAction(state, (s) => ({
        ...s,
        routeHits: [],
    }));

    const setRecording = reduceAction(state, (s, isRecording: boolean) => ({ ...s, isRecording }));

    options.routerStore
           .observe()
           .subscribe(s => {
               if(state.value.isRecording === true) {
                // console.info("got new route hit: " + s.currentHit.url)
                    addRouteHit(s.currentHit)
               }
           });

    return {
        ...store,
        clear,
        setRecording,
    }
};

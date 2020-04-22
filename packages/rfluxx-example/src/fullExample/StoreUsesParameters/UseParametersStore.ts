import { handleAction, handleActionVoid, IInjectedStoreOptions, IStore, reduceAction, useStore } from "rfluxx";
import { Observable } from 'rxjs';
import { RouteParameters } from 'rfluxx-routing';

/**
 * The state of the store { @see UseParametersStore }.
 */
export interface IUseParametersStoreState
{
    /**
     * A string value representing the parameter value from parameter "value"
     */
    parameterValue: string;
}

/**
 * The options to configure the store { @see UseParametersStore }.
 */
export interface IUseParametersStoreOptions
    extends IInjectedStoreOptions
{
    routeParameters: Observable<RouteParameters>;
}

/**
 * The interface that exposes the commands of the store { @see UseParametersStore }.
 */
export interface IUseParametersStore extends IStore<IUseParametersStoreState>
{
}

/**
 * Store that uses the route parameters observable.
 */
export const UseParametersStore = (options: IUseParametersStoreOptions) => {
    const initialState = {
        parameterValue: ""
    };
    const [state, setState, store] = useStore<IUseParametersStoreState>(initialState);

    options.routeParameters.subscribe(p => {
        setState({
            parameterValue: p.get("value")
        })
    })

    return {
        ...store
    }
};

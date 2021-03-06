import * as React from "react";
import { useCallback } from "react";

import { IUseStoreFromContainerContextProps, useStoreStateFromContainerContext } from "../../src";

import { ICounterStore, ICounterStoreState } from "./CounterStore";

/**
 * Props for { @FuncCounter }
 */
export interface IFuncCounterProps extends IUseStoreFromContainerContextProps
{
}

/**
 * Component that shows a counter and is bound via a hook.
 */
export const FuncCounter: React.SFC<IFuncCounterProps> = props =>
{
    const [ storeState, store ] = useStoreStateFromContainerContext<ICounterStore, ICounterStoreState>(props);
    const increment = useCallback(() => store.increment.trigger(1), [ store ]);

    if (!storeState)
    {
        return null;
    }

    return <div>
        <div>Hello Func Counter {storeState.counter}</div>
        <button onClick={increment}>Increment</button>
    </div>;
}

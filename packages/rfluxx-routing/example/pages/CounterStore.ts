import { IAction, IStore, Store } from "rfluxx";

import { IPageRequest } from "../../src/PageCommunication";
import { IPageStore } from "../../src/PageStore";

export interface ICounterStoreState
{
    counter: number;
}

export interface ICounterStoreOptions
{
    pageRequest: IPageRequest;
    pageStore: IPageStore;
}

/**
 * This is the interface by which the store is available in the components.
 * It offers a command to increment the counter.
 */
export interface ICounterStore extends IStore<ICounterStoreState> {
    increment: IAction<number>;
    setCount: IAction<number>;

    /**
     * Tell the counter on the given url path the count of this counter.
     */
    tellCounter: IAction<string>;
}

export class CounterStore extends Store<ICounterStoreState> implements ICounterStore
{
    public readonly increment: IAction<number>;
    public setCount: IAction<number>;
    public tellCounter: IAction<string>;

    public constructor(private options: ICounterStoreOptions)
    {
        super({
            initialState: {
                counter: 0
            }
        });

        // create an action that is observable by the store and subscribe it
        this.increment = this.createActionAndSubscribe<number>(increment =>
            {
                // when the action is triggered the subscription is called
                // we increment the counter of this store
                this.setState(({
                    ...this.state,
                    counter: this.state.counter + increment
                }));
            },
            {
                name: "increment"
            });

        this.setCount = this.createActionAndSubscribe<number>(count =>
            {
                this.setState(({
                    ...this.state,
                    counter: count
                }));
            });

        this.tellCounter = this.createActionAndSubscribe<string>(urlPath =>
            {
                // one way communication
                this.options.pageStore.requestPage(
                    urlPath,
                    this.state.counter);
            });

        if (options.pageRequest)
        {
            this.setCount.trigger(options.pageRequest.data);
        }
    }
}

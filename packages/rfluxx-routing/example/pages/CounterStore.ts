import { IAction, IStore, Store } from "rfluxx";

export interface ICounterStoreState {
    counter: number;
}

/**
 * This is the interface by which the store is available in the components.
 * It offers a command to increment the counter.
 */
export interface ICounterStore extends IStore<ICounterStoreState> {
    increment: IAction<number>;
}

export class CounterStore extends Store<ICounterStoreState> implements ICounterStore
{
    public readonly increment: IAction<number>;

    public constructor()
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
    }
}

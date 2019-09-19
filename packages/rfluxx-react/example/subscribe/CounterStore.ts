import * as Flux from "rfluxx";

export interface ICounterStoreState {
    counter: number;
}

/**
 * This is the interface by which the store is available in the components.
 * It offers a command to increment the counter.
 */
export interface ICounterStore extends Flux.IStore<ICounterStoreState>
{
    increment: Flux.IAction<number>;
}

export class CounterStore extends Flux.Store<ICounterStoreState> implements ICounterStore
{
    public readonly increment: Flux.IAction<number>;

    constructor()
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
        });
    }
}

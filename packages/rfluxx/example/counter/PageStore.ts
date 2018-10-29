import * as Flux from "../../src";

export interface IPageStoreState {
    counter: number;
}

/**
 * This is the interface by which the store is available in the components.
 * It offers a command to increment the counter.
 */
export interface IPageStore extends Flux.IStore<IPageStoreState> {
    increment: Flux.IAction<number>;
}

class PageStore extends Flux.Store<IPageStoreState> implements IPageStore {
    public readonly increment: Flux.IAction<number>;

    constructor() {
        super({
            initialState: {
                counter: 0
            }
        });

        // create an action that is observable by the store and subscribe it
        this.increment = this.createActionAndSubscribe<number>(increment => {
            // when the action is triggered the subscription is called
            // we increment the counter of this store
            this.setState(({
                ...this.state,
                counter: this.state.counter + increment
            }));
        });
    }
}

// publish an instance of this store
// you can do this in a nicer way by using a container
// we keep it simple here on purpose
export const pageStore: IPageStore = new PageStore();

import * as Stores from "../src/Store";
import * as Commands from "../src/Command";

export interface IPageStoreState {
    counter: number;
}

/** 
 * This is the interface by which the store is available in the components.
 * It offers a command to increment the counter.
 */
export interface IPageStore extends Stores.IStore<IPageStoreState> {    
    increment: Commands.ICommand<number>;
}

class PageStore extends Stores.Store<IPageStoreState> implements IPageStore {
    public readonly increment: Commands.ICommand<number>;

    constructor(){
        super({
            initialState: {
                counter: 0
            }
        });

        // create a command that is observable by the store and subscribe it
        this.increment = this.createCommandAndSubscribe<number>(increment => {
            // when the command is execute the subscription is called
            // we increment the counter of this store
            this.updateState(currentState => ({
                ...currentState,
                counter: currentState.counter + increment
            }));
        });
    }
}

// publish an instance of this store 
// you can do this in a nicer way by using a container
// we keep it simple here on purpose
export const pageStore: IPageStore = new PageStore();
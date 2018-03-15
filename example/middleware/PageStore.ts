import * as Flux from "../../src";
import { IActionFactory } from '../../src/ActionFactory/IActionFactory';
import { MiddlewareActionFactory } from '../../src/ActionFactory/MiddlewareActionFactory';
import { ConsoleLoggingMiddleware } from '../../src/Middleware';

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

    constructor(actionFactory: IActionFactory) {
        super({
            initialState: {
                counter: 0
            },
            actionFactory: actionFactory
        });

        // create an action that is observable by the store and subscribe it
        this.increment = this.createActionAndSubscribe<number>(increment => {
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

// this is the action factory that applies the middleware to all actions
// we use a middleware that logs all actions to the console
const actionFactory = new MiddlewareActionFactory(
    [new ConsoleLoggingMiddleware()]
);

// publish an instance of this store 
// you can do this in a nicer way by using a container
// we keep it simple here on purpose 
export const pageStore: IPageStore = new PageStore(actionFactory); 
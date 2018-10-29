import * as Flux from "../../src";
import { IActionFactory } from "../../src/ActionFactory/IActionFactory";
import { MiddlewareActionFactory } from "../../src/ActionFactory/MiddlewareActionFactory";
import { SimpleContainer } from "../../src/DependencyInjection/SimpleContainer";
import { ConsoleLoggingMiddleware } from "../../src/Middleware";
import { ActionEventLog } from "../../src/Middleware/ActionEventLog/ActionEventLog";
import { ActionEventLogMiddleware } from "../../src/Middleware/ActionEventLog/ActionEventLogMiddleware";
import { TimeTraveler } from "../../src/Middleware/ActionEventLog/TimeTraveler";
import { RegisterTimeTraveler } from "../../src/Middleware/ActionEventLog/TimeTravelerFactory";

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
            actionFactory
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

const container = new SimpleContainer();

container.registerInCollection("IActionMiddleware[]", () => new ConsoleLoggingMiddleware());
RegisterTimeTraveler(container, true);
container.registerInCollection("IResetMyState[]", c => new PageStore(c.resolve("IActionFactory")), "IPageStore");

// publish an instance of this store
// you can do this in a nicer way by using a container
// we keep it simple here on purpose
export const pageStore: IPageStore = container.resolve("IPageStore") as IPageStore;

// resolve the time traveler
// this will put it into the window
container.resolve("TimeTraveler");

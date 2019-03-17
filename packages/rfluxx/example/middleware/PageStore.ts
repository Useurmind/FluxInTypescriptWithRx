import * as Flux from "../../src";
import { IInjectedStoreOptions } from "../../src";
import { IActionFactory } from "../../src/ActionFactory/IActionFactory";
import { MiddlewareActionFactory } from "../../src/ActionFactory/MiddlewareActionFactory";
import { registerStore } from "../../src/DependencyInjection/RegisterStoreUtility";
import { SimpleContainer } from "../../src/DependencyInjection/SimpleContainer";
import { SimpleContainerBuilder } from "../../src/DependencyInjection/SimpleContainerBuilder";
import { ConsoleLoggingMiddleware } from "../../src/Middleware";
import { ActionEventLog } from "../../src/Middleware/ActionEventLog/ActionEventLog";
import { ActionEventLogMiddleware } from "../../src/Middleware/ActionEventLog/ActionEventLogMiddleware";
import { registerTimeTraveler } from "../../src/Middleware/ActionEventLog/RegisterTimeTravelerUtility";
import { TimeTraveler } from "../../src/Middleware/ActionEventLog/TimeTraveler";

export interface IPageStoreState {
    counter: number;
}

export interface IPageStoreOptions extends IInjectedStoreOptions
{

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

    constructor(options: IPageStoreOptions)
    {
        super({
            ...options,
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

const builder = new SimpleContainerBuilder();

builder.register(() => new ConsoleLoggingMiddleware())
    .in("IActionMiddleware[]");
registerTimeTraveler(builder, true, "MiddlewareDemo");
registerStore(builder, "IPageStore", (c, injectOptions) => new PageStore(injectOptions({})));

const container = builder.build();

// publish an instance of this store
// you can do this in a nicer way by using a container
// we keep it simple here on purpose
export const pageStore: IPageStore = container.resolve<IPageStore>("IPageStore");

// resolve the time traveler
// this will put it into the window
container.resolve<TimeTraveler>("TimeTraveler");

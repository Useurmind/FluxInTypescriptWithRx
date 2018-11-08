import { ConsoleLoggingMiddleware, IActionMiddleware } from "..";
import { IAction, IActionFactory, MiddlewareActionFactory } from "../..";
import { IContainer } from "../../DependencyInjection/IContainer";
import { IContainerBuilder } from "../../DependencyInjection/IContainerBuilder";
import { IResetMyState } from "../../IResetMyState";

import { ActionEventLog } from "./ActionEventLog";
import { ActionEventLogMiddleware } from "./ActionEventLogMiddleware";
import { IActionEventLog } from "./IActionEventLog";
import { INeedToKnowAboutReplay } from "./INeedToKnowAboutReplay";
import { INeedToKnowIfIAmInThePast } from "./INeedToKnowIfIAmInThePast";
import { TimeTraveler } from "./TimeTraveler";

/**
 * This function registers all required components for the time traveling functionality in the given container.
 * The registered components include
 * - event log
 * - event log middleware
 * - action factory as IActionFactory
 * - time traveler
 * If you want to register more middleware or other implementations of { @see INeedToKnowAboutReplay }
 * or { @see INeedToKnowIfIAmInThePast} then you should use the following calls:
 * - registerInCollection("IActionMiddleware[]", ...)
 * - registerInCollection("INeedToKnowIfIAmInThePast[]", ...)
 * - registerInCollection("INeedToKnowAboutReplay[]", ...)
 * @param containerBuilder The container builder where the components are registered.
 * @param registerWithWindow Should the event log and time traveler be put into the window itself as
 * window.timeTraveler and window.eventLog.
 */
export function RegisterTimeTraveler(containerBuilder: IContainerBuilder, registerWithWindow?: boolean): void
{
    containerBuilder.register("IActionEventLog", c => new ActionEventLog());
    containerBuilder.registerInCollection(
        ["IActionMiddleware[]", "INeedToKnowAboutReplay[]", "INeedToKnowIfIAmInThePast[]"],
        c => new ActionEventLogMiddleware(c.resolve<IActionEventLog>("IActionEventLog")));
    containerBuilder.register(
        "IActionFactory",
        c => new MiddlewareActionFactory(c.resolve<IActionMiddleware[]>("IActionMiddleware[]")));
    containerBuilder.register("TimeTraveler", c =>
    {
        const eventLog = c.resolve<IActionEventLog>("IActionEventLog");
        const timeTraveler = new TimeTraveler(
            eventLog,
            () => c.resolve<INeedToKnowAboutReplay[]>("INeedToKnowAboutReplay[]"),
            () => c.resolve<IResetMyState[]>("IResetMyState[]"),
            () => c.resolve<INeedToKnowIfIAmInThePast[]>("INeedToKnowIfIAmInThePast[]"),
            null
        );

        if (registerWithWindow)
        {
            (window as any).timeTraveler = timeTraveler;
            (window as any).eventLog = eventLog;
        }

        return timeTraveler;
    });
}

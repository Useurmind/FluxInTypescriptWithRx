import { ConsoleLoggingMiddleware, IActionMiddleware } from "..";
import { IAction, IActionFactory, MiddlewareActionFactory } from "../..";
import { DefaultActionFactory } from "../../ActionFactory/DefaultActionFactory";
import { IActionRegistry } from "../../ActionFactory/IActionRegistry";
import { MapActionRegistry } from "../../ActionFactory/MapActionRegistry";
import { IContainer } from "../../DependencyInjection/IContainer";
import { IContainerBuilder } from "../../DependencyInjection/IContainerBuilder";
import { ObservableFetcher } from "../../Fetch/ObservableFetcher";
import { IResetMyState } from "../../IResetMyState";

import { ActionEventLog } from "./ActionEventLog";
import { ActionEventLogMiddleware } from "./ActionEventLogMiddleware";
import { ActionEventLogPreserver } from "./ActionEventLogPreserver";
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
export function registerTimeTraveler(
    containerBuilder: IContainerBuilder,
    registerWithWindow?: boolean,
    actionEventLogStorageKey?: string): void
{
    containerBuilder.register(c => new MapActionRegistry())
                    .as("IActionRegistry");
    containerBuilder.register(
        c => new DefaultActionFactory(
                c.resolve<IActionMiddleware[]>("IActionMiddleware[]"),
                c.resolve<IActionRegistry>("IActionRegistry")))
                .as("DefaultActionFactory").as("IActionFactory");

    containerBuilder.register(c => new ObservableFetcher())
                    .as("IObservableFetcher");

    if (actionEventLogStorageKey)
    {
        containerBuilder.register(
            c => new ActionEventLogPreserver(actionEventLogStorageKey))
            .as("ActionEventLogPreserver").as("IActionEventLogPreserver");
    }

    containerBuilder.register(
        c => new ActionEventLog(c.resolve<ActionEventLogPreserver>("ActionEventLogPreserver")))
        .as("IActionEventLog");

    containerBuilder.register(
        c => new ActionEventLogMiddleware(c.resolve<IActionEventLog>("IActionEventLog")))
        .in("IActionMiddleware[]").in("INeedToKnowAboutReplay[]").in("INeedToKnowIfIAmInThePast[]");

    containerBuilder.register(c =>
    {
        const eventLog = c.resolve<IActionEventLog>("IActionEventLog");
        const timeTraveler = new TimeTraveler(
            eventLog,
            () => c.resolve<INeedToKnowAboutReplay[]>("INeedToKnowAboutReplay[]"),
            () => c.resolve<IResetMyState[]>("IResetMyState[]"),
            () => c.resolve<INeedToKnowIfIAmInThePast[]>("INeedToKnowIfIAmInThePast[]"),
            c.resolve<IActionRegistry>("IActionRegistry")
        );

        if (registerWithWindow)
        {
            (window as any).timeTraveler = timeTraveler;
            (window as any).eventLog = eventLog;
        }

        return timeTraveler;
    }).as("TimeTraveler");
}

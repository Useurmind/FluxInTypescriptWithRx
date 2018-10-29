import { ConsoleLoggingMiddleware } from "..";
import { IActionFactory, MiddlewareActionFactory } from "../..";
import { IContainer } from "../../DependencyInjection/IContainer";
import { IResetMyState } from "../../IResetMyState";

import { ActionEventLog } from "./ActionEventLog";
import { ActionEventLogMiddleware } from "./ActionEventLogMiddleware";
import { IActionEventLog } from "./IActionEventLog";
import { INeedToKnowAboutReplay } from "./INeedToKnowAboutReplay";
import { INeedToKnowIfIAmInThePast } from "./INeedToKnowIfIAmInThePast";
import { TimeTraveler } from "./TimeTraveler";

export function RegisterTimeTraveler(container: IContainer, registerWithWindow?: boolean): void {
    container.register("IActionEventLog", c => new ActionEventLog());
    container.registerInCollection(["IActionMiddleware[]", "INeedToKnowAboutReplay[]", "INeedToKnowIfIAmInThePast[]"], c => new ActionEventLogMiddleware(c.resolve("IActionEventLog")));
    container.register("IActionFactory", c => new MiddlewareActionFactory(c.resolve("IActionMiddleware[]")));
    container.register("TimeTraveler", c => {
        const eventLog = c.resolve("IActionEventLog") as IActionEventLog;
        const timeTraveler = new TimeTraveler(
            eventLog,
            () => c.resolve("INeedToKnowAboutReplay[]") as INeedToKnowAboutReplay[],
            () => c.resolve("IResetMyState[]") as IResetMyState[],
            () => c.resolve("INeedToKnowIfIAmInThePast[]") as INeedToKnowIfIAmInThePast[],
            null
        );

        if (registerWithWindow) {
            (window as any).timeTraveler = timeTraveler;
            (window as any).eventLog = eventLog;
        }

        return timeTraveler;
    });
}

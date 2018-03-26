import { ActionEventLog } from './ActionEventLog';
import { ActionEventLogMiddleware } from './ActionEventLogMiddleware';
import { MiddlewareActionFactory, IActionFactory } from '../..';
import { ConsoleLoggingMiddleware } from '..';
import { IResetMyState } from '../../../example/dist/out/src/IResetMyState';
import { TimeTraveler } from './TimeTraveler';
import { IActionEventLog } from '../../../example/dist/out/src/Middleware/ActionEventLog/IActionEventLog';
import { IActionMiddleware } from '../../../example/dist/out/src';
import { IContainer } from '../../DependencyInjection/IContainer';
import { INeedToKnowAboutReplay } from './INeedToKnowAboutReplay';
import { INeedToKnowIfIAmInThePast } from './INeedToKnowIfIAmInThePast';

export function RegisterTimeTraveler(container: IContainer, registerWithWindow?: boolean): void {
    container.register("IActionEventLog", c => new ActionEventLog());
    container.registerInCollection(["IActionMiddleware[]", "INeedToKnowAboutReplay[]", "INeedToKnowIfIAmInThePast[]"], c => new ActionEventLogMiddleware(c.resolve("IActionEventLog")));
    container.register("IActionFactory", c => new MiddlewareActionFactory(c.resolve("IActionMiddleware[]")));
    container.register("TimeTraveler", c => {
        let eventLog = <IActionEventLog>c.resolve("IActionEventLog");
        let timeTraveler = new TimeTraveler(
            eventLog,
            () => <INeedToKnowAboutReplay[]>c.resolve("INeedToKnowAboutReplay[]"),
            () => <IResetMyState[]>c.resolve("IResetMyState[]"),
            () => <INeedToKnowIfIAmInThePast[]>c.resolve("INeedToKnowIfIAmInThePast[]"),
            null
        );

        if(registerWithWindow) {
            (<any>window).timeTraveler = timeTraveler;
            (<any>window).eventLog =eventLog
        }

        return timeTraveler;
    })
}
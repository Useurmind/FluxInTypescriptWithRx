import { DefaultActionFactory } from "../ActionFactory/DefaultActionFactory";
import { IActionRegistry } from "../ActionFactory/IActionRegistry";
import { MapActionRegistry } from "../ActionFactory/MapActionRegistry";
import { IActionMiddleware } from "../Middleware/IActionMiddleware";

import { IContainerBuilderEssential } from "./IContainerBuilder";

/**
 * Register the action factory and action registry.
 * - Registers { @see DefaultActionFactory } as 'IActionFactory' and 'DefaultActionFactory'
 * - Registers { @see MapActionRegistry } as 'IActionRegistry'
 * @param builder The container builder to register the factory and registry into.
 */
export function registerDefaultActionFactory(builder: IContainerBuilderEssential)
{
    builder.register(c => new MapActionRegistry())
        .as("IActionRegistry");
    builder.register(
                c => new DefaultActionFactory(
                    // resolve empty array if none were registered
                    c.resolveMultiple<IActionMiddleware>("IActionMiddleware[]"),
                    c.resolve<IActionRegistry>("IActionRegistry")))
           .as("DefaultActionFactory").as("IActionFactory");
}

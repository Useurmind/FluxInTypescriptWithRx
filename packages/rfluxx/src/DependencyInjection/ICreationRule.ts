import { IContainer } from "./IContainer";

/**
 * An interface for creation rule.
 * This is a function that creates an instance which can be resolved via
 * the container.
 */
export interface ICreationRule
{
    (c: IContainer): any;
}

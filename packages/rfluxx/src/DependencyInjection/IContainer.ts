/**
 * Simple interface for a container implementation.
 */
export interface IContainer
{
    /**
     * Resolve a component with the given type name.
     * @param key The to resolve, usually the type name, e.g. IMyStore or IAction[].
     * @returns The resolved component.
     */
    resolve<T>(key: string): T;
}

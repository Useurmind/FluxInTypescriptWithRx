/**
 * Simple interface for a container implementation.
 */
export interface IContainer
{
    /**
     * Resolve a component with the given key.
     * @param key The key to resolve, usually the type name, e.g. IMyStore or IAction[].
     * @param instanceName The name of the instance to resolve. You will get a different object per instance name.
     *                     In case of collections the instance name will create a completely distinct collection.
     *                     Optional, no instance name will return a default instance.
     *                     You can use this value to reuse the same store in different react components of your pages
     *                     with a different state.
     * @returns The resolved component or throws an error if non was registered under the key.
     */
    resolve<T>(key: string, instanceName?: string): T;

    /**
     * Resolve a component with the given key.
     * @param key The key to resolve, usually the type name, e.g. IMyStore or IAction[].
     * @param instanceName The name of the instance to resolve. You will get a different object per instance name.
     *                     In case of collections the instance name will create a completely distinct collection.
     *                     Optional, no instance name will return a default instance.
     *                     You can use this value to reuse the same store in different react components of your pages
     *                     with a different state.
     * @returns The resolved component or null if non was registered under the key.
     */
    resolveOptional<T>(key: string, instanceName?: string): T;

    /**
     * Explicitely resolve a collection of objects with the given key.
     * @param key The key to resolve, usually the type name, e.g. IAction[].
     * @param instanceName The name of the instance to resolve. You will get a different object per instance name.
     *                     In case of collections the instance name will create a completely distinct collection.
     *                     Optional, no instance name will return a default instance.
     *                     You can use this value to reuse the same store in different react components of your pages
     *                     with a different state.
     * @returns The resolved collection or an empty array if non was registered under the key.
     */
    resolveMultiple<T>(key: string, instanceName?: string): T[];
}

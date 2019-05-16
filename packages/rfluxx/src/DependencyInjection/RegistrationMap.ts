import { IContainer } from "./IContainer";
import { IResolveWithInstanceName } from "./SimpleContainerBuilder";

/**
 * A map of registered creation rules.
 * Each rule can be retrieved by any key under which it was registered.
 */
export class RegistrationMap
{
    private registrationsByKey: Map<string, IResolveWithInstanceName | IResolveWithInstanceName[]> = new Map();

    /**
     * Register a creation function under a specific key that should return only one instance.
     * @param createSingleton The function to create an instance.
     * @param key The key to register the function under.
     */
    public registerAs(createSingleton: IResolveWithInstanceName, key: string): void
    {
        this.registrationsByKey.set(
            key,
            (c: IContainer, instanceName?: string) => createSingleton(c, instanceName));
    }

    /**
     * Register a creation function under a specific key that should return an array of instances.
     * @param createSingleton The function to create an instance.
     * @param collectionKey The key of the collection to register the function in.
     */
    public registerIn(createSingleton: IResolveWithInstanceName, collectionKey: string): void
    {
        if (!this.registrationsByKey.get(collectionKey))
        {
            this.registrationsByKey.set(collectionKey, []);
        }
        const resolvers = this.registrationsByKey.get(collectionKey) as IResolveWithInstanceName[];
        resolvers.push(createSingleton);
    }

    /**
     * Get the registered resolvers under a given key.
     * @param key The key to resolve.
     */
    public get(key: string): IResolveWithInstanceName | IResolveWithInstanceName[]
    {
        return this.registrationsByKey.get(key);
    }
}

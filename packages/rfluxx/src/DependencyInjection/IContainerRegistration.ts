/**
 * Interface to specify the details of how a creation rule should be resolvable.
 */
export interface IContainerRegistration
{
    /**
     * Register the creation rule under the given key.
     * @param key The key to register the creation rule under.
     */
    as(key: string): IContainerRegistration;

    /**
     * Register the creation rule in the collection with the given key.
     * @param collectionKey The key of the collection to register the creation rule in.
     */
    in(collectionKey: string): IContainerRegistration;
}

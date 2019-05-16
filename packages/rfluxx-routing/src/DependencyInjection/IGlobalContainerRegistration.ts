import { IContainerRegistration } from "rfluxx";
/**
 * The default container registration interface extend by several page awareness methods.
 */
export interface IGlobalContainerRegistration
{
    /**
     * Share the instances created from this registration globally with all pages.
     * Only a single instance will be created in the whole app per instance name.
     */
    shareGlobally(): IGlobalContainerRegistration;

    /**
     * Register the creation rule under the given key.
     * Duplicated from { @see IContainerRegistration } because of different return type
     * @param key The key to register the creation rule under.
     */
    as(key: string): IGlobalContainerRegistration;

    /**
     * Register the creation rule in the collection with the given key.
     * Duplicated from { @see IContainerRegistration } because of different return type
     * @param collectionKey The key of the collection to register the creation rule in.
     */
    in(collectionKey: string): IGlobalContainerRegistration;
}

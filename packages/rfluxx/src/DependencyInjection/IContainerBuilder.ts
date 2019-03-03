import { IContainer } from "./IContainer";

/**
 * An interface for a function that creates an instance for the container.
 */
export interface IResolver
{
    (c: IContainer): any;
}

/**
 * Interface to register stuff in your container.
 * The standard registration logic provided by the framework runs on this interface.
 * You can implement this interface with the container of your choice to be able to use the
 * integrated registration logic.
 */
export interface IContainerBuilder
{
    /**
     * Register a type to be constructed (assumes singleton registration).
     * @param typeName The name of the (multiple) type(s) to register the component under.
     * @param create A function that creates the instance with the help of the container.
     */
    register(typeName: string|string[], create: IResolver): void;

    /**
     * Register a type to be constructed and put into a collection with other types of the same name.
     * @param collectionName The name of the collection (or multiple) in which to register the type.
     * @param create A function that creates the instance with the help of the container.
     * @param typeName Optional type name to resolve the type separate from the collection.
     */
    registerInCollection(collectionName: string|string[], create: IResolver, typeName?: string): void;
}

import { IContainer } from "./IContainer";

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
     * @param typeName The name of the type to register.
     * @param create A function that creates the instance with the help of the container.
     */
    register(typeName: string, create: (c: IContainer) => any): void;

    /**
     * Register a type to be constructed and put into a collection with other types of the same name.
     * @param collectionName The name of the collection (or multiple) in which to register the type.
     * @param create A function that creates the instance with the help of the container.
     * @param typeName Optional type name to resolve the type separate from the collection.
     */
    registerInCollection(collectionName: string|string[], create: (c: IContainer) => any, typeName?: string): void;
}

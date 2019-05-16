import { IContainer } from "./IContainer";
import { IContainerRegistration } from "./IContainerRegistration";
import { ICreationRule } from "./ICreationRule";

/**
 * Interface to register stuff in your container.
 * The standard registration logic provided by the framework runs on this interface.
 * You can implement this interface with the container of your choice to be able to use the
 * integrated registration logic.
 */
export interface IContainerBuilder extends IContainerBuilderEssential
{
    /**
     * Add a parent container to the container being build.
     * The container that is build will use the parent container to resolve stuff he does not know.
     * @param parentContainer The parent container.
     */
    addParentContainer(parentContainer: IContainer);

    /**
     * Build the container with all currently registered creation rules.
     */
    build(): IContainer;
}

/**
 * Minimal interface only for registration
 */
export interface IContainerBuilderEssential
{
    /**
     * Register a creation rule.
     * @param create A creation rule (which is a function) that creates whatever you like.
     */
    register(create: ICreationRule): IContainerRegistration;
}

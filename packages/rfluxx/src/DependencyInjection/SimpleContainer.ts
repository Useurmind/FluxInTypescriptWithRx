import { IContainer } from "./IContainer";
import { IContainerBuilder } from "./IContainerBuilder";
import { IContainerRegistration } from "./IContainerRegistration";
import { ICreationRule } from "./ICreationRule";
import { RegistrationMap } from "./RegistrationMap";
import { IResolveWithInstanceName } from "./SimpleContainerBuilder";
import { SimpleContainerRegistration } from "./SimpleContainerRegistration";

/**
 * Interface to describe the instances resolved for a typename.
 */
interface IInstancesForTypeName
{
    /**
     * The default instance resolved without an instance name.
     */
    defaultInstance: any;

    /**
     * The instances that were resolved with a type name.
     */
    namedInstances: Map<string, any>;
}

/**
 * Simple container implements the container interface by holding an internal map.
 */
export class SimpleContainer implements IContainer
{
    private instanceMap: Map<string, IInstancesForTypeName> = new Map();

    /**
     * Create the container.
     * @param registrationMap The map containing all registrations.
     * @param parentContainers A list of parent containers that should be tried for resolution
     *  when dependency is not found locally.
     */
    constructor(private registrationMap: RegistrationMap, private parentContainers: IContainer[])
    {
    }

    /**
     * @inheritDoc
     */
    public resolve<T>(key: string, instanceName?: string): T
    {
        return this.resolveInternal<T>(key, false, instanceName);
    }

    /**
     * @inheritDoc
     */
    public resolveOptional<T>(key: string, instanceName?: string): T
    {
        return this.resolveInternal<T>(key, true, instanceName);
    }

    /**
     * @inheritDoc
     */
    public resolveMultiple<T>(key: string, instanceName?: string): T[]
    {
        let result = this.resolveInternal<T[]>(key, true, instanceName);
        if (!result)
        {
            result = [];
        }

        return result;
    }

    /**
     * @inheritDoc
     */
    private resolveInternal<T>(key: string, optional: boolean, instanceName?: string): T
    {
        let instancesPerTypeName = this.instanceMap.get(key);
        if (!instancesPerTypeName)
        {
            instancesPerTypeName = {
                defaultInstance: null,
                namedInstances: new Map()
            };
            this.instanceMap.set(key, instancesPerTypeName);
        }

        let instance = instancesPerTypeName.defaultInstance;
        if (instanceName)
        {
            instance = instancesPerTypeName.namedInstances.get(instanceName);
        }

        if (!instance)
        {
            const create = this.registrationMap.get(key);
            if (!create)
            {
                if (!optional)
                {
                    instance = this.tryResolveFromParentContainers(key, instanceName);
                    if (instance)
                    {
                        return instance as T;
                    }

                    throw new Error(`Could not find any registrations for key '${key}' in container`);
                }
                else
                {
                    return null;
                }
            }

            if (typeof create === "function")
            {
                // single create function
                instance = create(this, instanceName);
            }
            else if (typeof create === "object")
            {
                // multiple create functions for a collection
                instance = create.map(x => x(this, instanceName));
            }

            if (!instanceName)
            {
                instancesPerTypeName.defaultInstance = instance;
            }
            else
            {
                instancesPerTypeName.namedInstances.set(instanceName, instance);
            }
        }

        return instance as T;
    }

    private tryResolveFromParentContainers(key: string, instanceName: string): any
    {
        for (const parent of this.parentContainers)
        {
            const instance = parent.resolveOptional(key, instanceName);
            if (instance)
            {
                return instance;
            }
        }
    }
}

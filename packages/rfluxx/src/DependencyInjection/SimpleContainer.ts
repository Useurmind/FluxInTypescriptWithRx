import { IContainer } from "./IContainer";
import { IContainerBuilder, IResolver } from "./IContainerBuilder";

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
 * We use this interface to make resolution of collection registrations
 * aware of multiple instance names.
 */
interface IResolveWithInstanceName
{
    (container: IContainer, instanceName: string): any;
}

/**
 * Simple container implements the container interface by holding an internal map.
 */
export class SimpleContainer implements IContainer, IContainerBuilder
{
    private registrationMap: Map<string, IResolveWithInstanceName | IResolveWithInstanceName[]> = new Map();
    private instanceMap: Map<string, IInstancesForTypeName> = new Map();

    /**
     * @inheritDoc
     */
    public register(typeName: string|string[], create: IResolver): void
    {
        // we want singleton behaviour for multiple names here
        const createSingleton = this.getSingletonCreator(create);

        let typeNames: string[] = typeName as string[];
        if (typeof typeName === "string")
        {
            typeNames = [typeName];
        }

        for (const name of typeNames)
        {
            this.registrationMap.set(name, (c: IContainer, instanceName?: string) => createSingleton(c, instanceName));
        }
    }

    /**
     * @inheritDoc
     */
    public registerInCollection(collectionName: string|string[], create: IResolver, typeName?: string)
        : void
    {
        // we want singleton behaviour for multiple names here
        const createSingleton = this.getSingletonCreator(create);

        let collectionNames: string[] = collectionName as string[];
        if (typeof collectionName === "string")
        {
            collectionNames = [collectionName];
        }

        collectionNames.forEach(name =>
        {
            if (!this.registrationMap.get(name))
            {
                this.registrationMap.set(name, []);
            }
            const resolvers = this.registrationMap.get(name) as IResolveWithInstanceName[];
            resolvers.push(createSingleton);
        });

        if (typeName)
        {
            this.registrationMap.set(typeName, (c: IContainer, instanceName?: string) => createSingleton(c, undefined));
        }
    }

    /**
     * @inheritDoc
     */
    public resolve<T>(typeName: string, instanceName?: string): T
    {
        let instancesPerTypeName = this.instanceMap.get(typeName);
        if (!instancesPerTypeName)
        {
            instancesPerTypeName = {
                defaultInstance: null,
                namedInstances: new Map()
            };
            this.instanceMap.set(typeName, instancesPerTypeName);
        }

        let instance = instancesPerTypeName.defaultInstance;
        if (instanceName)
        {
            instance = instancesPerTypeName.namedInstances.get(instanceName);
        }

        if (!instance)
        {
            const create = this.registrationMap.get(typeName);
            if (!create)
            {
                throw new Error(`Could not find any registrations for typeName '${typeName}' in container`);
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

    private getSingletonCreator(create: IResolver)
    {
        const createSingleton = ((() =>
        {
            let defaultInstance: any = null;
            const namedInstances = new Map<string, any>();
            const createSingletonInner = (container: IContainer, instanceName: string) =>
            {
                let instance = null;
                if (!instanceName)
                {
                    instance = defaultInstance;
                }
                else
                {
                    instance = namedInstances.get(instanceName);
                }

                if (!instance)
                {
                    instance = create(container);
                }

                if (!instanceName)
                {
                    defaultInstance = instance;
                }
                else
                {
                    namedInstances.set(instanceName, instance);
                }

                return instance;
            };

            return createSingletonInner;
        })());

        return createSingleton;
    }
}

import { IContainer } from "./IContainer";
import { ICreationRule } from "./ICreationRule";
import { IResolveWithInstanceName } from "./SimpleContainerBuilder";

export function getSingletonCreator(create: ICreationRule): IResolveWithInstanceName
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

import { IContainer } from "./IContainer";
import { IContainerRegistration } from "./IContainerRegistration";
import { IResolveWithInstanceName, RegistrationMap } from "./SimpleContainerBuilder";

/**
 * Implementation of IContainerRegistration for the SimpleContainer.
 */
export class SimpleContainerRegistration implements IContainerRegistration
{
    constructor(
        private registrationMap: RegistrationMap,
        private createSingleton: IResolveWithInstanceName)
    {}

    /**
     * @inheritDoc
     */
    public as(key: string): IContainerRegistration
    {
        this.registrationMap.set(
            key,
            (c: IContainer, instanceName?: string) => this.createSingleton(c, instanceName));

        return this;
    }

    /**
     * @inheritDoc
     */
    public in(collectionKey: string): IContainerRegistration
    {
        if (!this.registrationMap.get(collectionKey))
        {
            this.registrationMap.set(collectionKey, []);
        }
        const resolvers = this.registrationMap.get(collectionKey) as IResolveWithInstanceName[];
        resolvers.push(this.createSingleton);

        return this;
    }
}

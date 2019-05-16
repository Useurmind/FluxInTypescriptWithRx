import { IContainer } from "./IContainer";
import { IContainerRegistration } from "./IContainerRegistration";
import { RegistrationMap } from "./RegistrationMap";
import { IResolveWithInstanceName } from "./SimpleContainerBuilder";

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
        this.registrationMap.registerAs(this.createSingleton, key);

        return this;
    }

    /**
     * @inheritDoc
     */
    public in(collectionKey: string): IContainerRegistration
    {
        this.registrationMap.registerIn(this.createSingleton, collectionKey);

        return this;
    }
}

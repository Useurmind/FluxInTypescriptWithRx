import { IResolveWithInstanceName, RegistrationMap } from "rfluxx";

import { IGlobalContainerRegistration } from "./IGlobalContainerRegistration";
import { IPageAwareContainerRegistration } from "./PageAwareContainerRegistration";

/**
 * Implementation of { @see IGlobalContainerRegistration }
 */
export class GlobalContainerRegistration implements IGlobalContainerRegistration
{
    /**
     *
     * @param registrationMap
     * @param createSingleton
     */
    constructor(private containerRegistration: IPageAwareContainerRegistration)
    {
    }

    /**
     * @inheritdoc
     */
    public shareGlobally(): IGlobalContainerRegistration
    {
        this.containerRegistration.isSharedGlobally = true;

        return this;
    }

    /**
     * @inheritdoc
     */
    public as(key: string): IGlobalContainerRegistration
    {
        this.containerRegistration.registeredAs.push(key);
        return this;
    }

    /**
     * @inheritdoc
     */
    public in(collectionKey: string): IGlobalContainerRegistration
    {
        this.containerRegistration.registeredIn.push(collectionKey);
        return this;
    }
}

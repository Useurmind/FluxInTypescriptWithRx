import { IResolveWithInstanceName, RegistrationMap } from "rfluxx";

import { ISiteMapNodeContainerRegistration } from "./ISiteMapNodeContainerRegistration";
import { IPageAwareContainerRegistration } from "./PageAwareContainerRegistration";

/**
 * Implementation of { @see ISiteMapNodeContainerRegistration }
 */
export class SiteMapNodeContainerRegistration implements ISiteMapNodeContainerRegistration
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
    public as(key: string): ISiteMapNodeContainerRegistration
    {
        this.containerRegistration.registeredAs.push(key);
        return this;
    }

    /**
     * @inheritdoc
     */
    public in(collectionKey: string): ISiteMapNodeContainerRegistration
    {
        this.containerRegistration.registeredIn.push(collectionKey);
        return this;
    }
}

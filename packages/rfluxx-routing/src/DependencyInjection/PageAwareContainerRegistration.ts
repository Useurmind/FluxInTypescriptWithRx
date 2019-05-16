import { ICreationRule, IResolveWithInstanceName, RegistrationMap } from "rfluxx";

import { ISiteMapNode } from "../SiteMap";

/**
 * Defines the properties of a registration in the global container builder.
 * Registrations will be reused across the containers of the different pages if
 * they are shared.
 */
export interface IPageAwareContainerRegistration
{
    /**
     * The site map node that owns the registration.
     * Not set for global registrations.
     */
    owner?: ISiteMapNode;

    /**
     * States if the instances produced by the registration should be shared
     * between all pages of the app.
     */
    isSharedGlobally?: boolean;

    /**
     * The keys as which this registration is registered.
     */
    registeredAs: string[];

    /**
     * The keys of the collections in which this registration is registered.
     */
    registeredIn: string[];

    /**
     * The creation function that creates an instance with the help of the container.
     */
    creationRule: ICreationRule;

    /**
     * Resolver for the registration.
     * Used to share registrations across multiple pages.
     */
    resolver?: IResolveWithInstanceName;
}

/**
 * Registers the registration in the registration map under the appropriate keys.
 * @param registrationMap The map to register in.
 * @param registration The registration to register.
 * @param resolver The resolver to use.
 */
export function registerInRegistrationMap(
    registrationMap: RegistrationMap,
    registration: IPageAwareContainerRegistration,
    resolver: IResolveWithInstanceName)
{
    for (const asKey of registration.registeredAs)
    {
        registrationMap.registerAs(resolver, asKey);
    }

    for (const inKey of registration.registeredIn)
    {
        registrationMap.registerIn(resolver, inKey);
    }
}

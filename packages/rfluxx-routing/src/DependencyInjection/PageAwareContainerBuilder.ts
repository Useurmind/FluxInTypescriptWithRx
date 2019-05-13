import { getSingletonCreator, IContainer, ICreationRule, RegistrationMap, SimpleContainer } from "rfluxx";

import { ISiteMapNode } from "../SiteMap/ISiteMapNode";

import { GlobalContainerRegistration } from "./GlobalContainerRegistration";
import { IGlobalContainerBuilder } from "./IGlobalContainerBuilder";
import { IGlobalContainerRegistration } from "./IGlobalContainerRegistration";
import { IPageAwareContainerRegistration, registerInRegistrationMap } from "./PageAwareContainerRegistration";

/**
 * This is the container builder that provides the capability to share
 * registered stores/modules between different pages.
 */
export class PageAwareContainerBuilder
{
    private globalRegistrations: IPageAwareContainerRegistration[] = [];
    private localRegistrations: Map<ISiteMapNode, IPageAwareContainerRegistration[]> = new Map();

    /**
     * This function is meant for usage by the global container factory.
     * The registrations are available in all pages although the instances are
     * not always shared between the pages.
     */
    public registerGlobally(create: ICreationRule): IGlobalContainerRegistration
    {
        const registration: IPageAwareContainerRegistration = {
            creationRule: create,
            registeredAs: [],
            registeredIn: []
        };

        this.globalRegistrations.push(registration);

        return new GlobalContainerRegistration(registration);
    }

    /**
     * Create a container for the given site map node.
     * @param siteMapNode The site map node for which to create a container.
     */
    public createContainer(siteMapNode: ISiteMapNode): IContainer
    {
        const registrationMap: RegistrationMap = new RegistrationMap();

        for (const globalRegistration of this.globalRegistrations)
        {
            if (globalRegistration.isSharedGlobally)
            {
                // if globally share we use the same resolve in each container
                globalRegistration.resolver = globalRegistration.resolver
                                                ? globalRegistration.resolver
                                                : getSingletonCreator(globalRegistration.creationRule);

                registerInRegistrationMap(registrationMap, globalRegistration, globalRegistration.resolver);
            }
            else
            {
                // if only globally registered we use different resolvers in each container
                const resolver = getSingletonCreator(globalRegistration.creationRule);
                registerInRegistrationMap(registrationMap, globalRegistration, resolver);
            }
        }

        return new SimpleContainer(registrationMap, []);
    }
}

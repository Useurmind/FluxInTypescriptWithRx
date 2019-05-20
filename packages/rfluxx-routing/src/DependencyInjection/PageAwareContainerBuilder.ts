import { getSingletonCreator, IContainer, ICreationRule, RegistrationMap, SimpleContainer } from "rfluxx";

import { ISiteMapNode } from "../SiteMap/ISiteMapNode";

import { IGlobalContainerBuilder } from "./GlobalContainerBuilder";
import { GlobalContainerRegistration } from "./GlobalContainerRegistration";
import { IGlobalContainerRegistration } from "./IGlobalContainerRegistration";
import { IPageAwareContainerBuilder } from "./IPageAwareContainerBuilder";
import { ISiteMapNodeContainerRegistration } from "./ISiteMapNodeContainerRegistration";
import { IPageAwareContainerRegistration, registerInRegistrationMap } from "./PageAwareContainerRegistration";
import { SiteMapNodeContainerRegistration } from "./SiteMapNodeContainerRegistration";

/**
 * This is the container builder that provides the capability to share
 * registered stores/modules between different pages.
 */
export class PageAwareContainerBuilder implements IPageAwareContainerBuilder
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
     * This function is meant for usage by the site map node container factory.
     * The registrations are available only in the pages of the given sitemap node
     * although the instances are not shared between the pages.
     * @param siteMapNode The site map node to register a creation rule for.
     * @param create The creation rule.
     */
    public registerLocally(siteMapNode: ISiteMapNode, create: ICreationRule): ISiteMapNodeContainerRegistration
    {
        const registration: IPageAwareContainerRegistration = {
            creationRule: create,
            registeredAs: [],
            registeredIn: []
        };

        let localRegistrations = null;
        if (this.localRegistrations.has(siteMapNode))
        {
            localRegistrations = this.localRegistrations.get(siteMapNode);
        }
        else
        {
            localRegistrations = [];
            this.localRegistrations.set(siteMapNode, localRegistrations);
        }

        localRegistrations.push(registration);

        return new SiteMapNodeContainerRegistration(registration);
    }

    /**
     * Create a container for a global context.
     * Per container created non shared instances will be different.
     */
    public createGlobalContainer(): IContainer
    {
        const registrationMap: RegistrationMap = new RegistrationMap();

        this.registerGlobalRegistrations(registrationMap);

        return new SimpleContainer(registrationMap, []);
    }

    /**
     * Create a container for the given site map node.
     * @param siteMapNode The site map node for which to create a container.
     */
    public createContainer(siteMapNode: ISiteMapNode): IContainer
    {
        const registrationMap: RegistrationMap = new RegistrationMap();

        this.registerGlobalRegistrations(registrationMap);

        this.registerLocalRegistrations(siteMapNode, registrationMap);

        return new SimpleContainer(registrationMap, []);
    }

    /**
     * Derive a clone from this builder that already contains all registrations
     * but can be extended independent of the original builder.
     */
    public derive(): IPageAwareContainerBuilder
    {
        const derivedBuilder = new PageAwareContainerBuilder();

        // we shallow clone on intend, resolvers should be kept
        // TODO: changes should not be allowed to existing registrations

        const globalRegistrations = [...this.globalRegistrations];
        derivedBuilder.setGlobalRegistrations(globalRegistrations);

        const localRegistrations = new Map();
        for (const entry of this.localRegistrations.entries())
        {
            localRegistrations.set(entry[0], [...entry[1]]);
        }
        derivedBuilder.setLocalRegistrations(localRegistrations);

        return derivedBuilder;
    }

    /**
     * Set the global registrations of this container.
     * @param globalRegistrations The global registrations to apply.
     */
    protected setGlobalRegistrations(globalRegistrations: IPageAwareContainerRegistration[]): void
    {
        this.globalRegistrations = globalRegistrations;
    }

    /**
     * Set the local registrations of this container.
     * @param localRegistrations The local registrations to apply.
     */
    protected setLocalRegistrations(localRegistrations: Map<ISiteMapNode, IPageAwareContainerRegistration[]>)
    {
        this.localRegistrations = localRegistrations;
    }

    private registerLocalRegistrations(siteMapNode: ISiteMapNode, registrationMap: RegistrationMap)
    {
        const localRegistrations = this.localRegistrations.get(siteMapNode);
        if (localRegistrations)
        {
            for (const localRegistration of localRegistrations)
            {
                const resolver = getSingletonCreator(localRegistration.creationRule);
                registerInRegistrationMap(registrationMap, localRegistration, resolver);
            }
        }
    }

    private registerGlobalRegistrations(registrationMap: RegistrationMap)
    {
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
    }
}

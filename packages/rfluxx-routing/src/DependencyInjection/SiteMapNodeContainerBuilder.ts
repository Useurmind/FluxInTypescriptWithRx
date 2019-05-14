import { IContainerBuilderEssential, ICreationRule } from "rfluxx";

import { ISiteMapNode } from "../SiteMap";

import { IPageAwareContainerBuilder } from "./IPageAwareContainerBuilder";
import { ISiteMapNodeContainerRegistration } from "./ISiteMapNodeContainerRegistration";

/**
 * Builder interface to be used by site map nodes.
 */
export interface ISiteMapNodeContainerBuilder extends IContainerBuilderEssential
 {
    /**
     * Register a service/store locally for a site map node.
     * @param create The creation rule.
     */
    register(create: ICreationRule): ISiteMapNodeContainerRegistration;
}

/**
 * The site map node container builder.
 */
export class SiteMapNodeContainerBuilder implements ISiteMapNodeContainerBuilder
{
    constructor(private builder: IPageAwareContainerBuilder, private siteMapNode: ISiteMapNode)
    {
    }

    /**
     * @inheritdoc
     */
    public register(create: ICreationRule): ISiteMapNodeContainerRegistration
    {
        return this.builder.registerLocally(this.siteMapNode, create);
    }
}

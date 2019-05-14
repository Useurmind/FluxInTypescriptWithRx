import { IContainerBuilderEssential, ICreationRule } from "rfluxx";

import { IGlobalContainerRegistration } from "./IGlobalContainerRegistration";
import { IPageAwareContainerBuilder } from "./IPageAwareContainerBuilder";

/**
 * Builder interface to be used by global container factory.
 */
export interface IGlobalContainerBuilder extends IContainerBuilderEssential
{
    /**
     * Register a service/store globally for the whole app.
     * @param create The creation rule.
     */
    register(create: ICreationRule): IGlobalContainerRegistration;
}

/**
 * global container builder.
 */
export class GlobalContainerBuilder implements IGlobalContainerBuilder
{
    constructor(private builder: IPageAwareContainerBuilder)
    {
    }

    /**
     * @inheritdoc
     */
    public register(create: ICreationRule): IGlobalContainerRegistration
    {
        return this.builder.registerGlobally(create);
    }
}

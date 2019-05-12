import { ICreationRule } from "rfluxx";

import { ISiteMapNodeContainerRegistration } from "./ISiteMapNodeContainerRegistration";
/**
 * A container builder interface for use inside the container factory of single site map nodes.
 */
export interface ISiteMapNodeContainerBuilder {
    /**
     * Start registering a creation rule.
     * @param create The rule that creates an instance.
     */
    register(create: ICreationRule): ISiteMapNodeContainerRegistration;
}

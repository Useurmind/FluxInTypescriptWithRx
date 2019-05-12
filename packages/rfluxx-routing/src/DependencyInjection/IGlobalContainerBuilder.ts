import { ICreationRule } from "rfluxx";

import { IGlobalContainerRegistration } from "./IGlobalContainerRegistration";
/**
 * A container builder interface for use inside the global container factory.
 */
export interface IGlobalContainerBuilder {
    /**
     * Start registering a creation rule.
     * @param create The rule that creates an instance.
     */
    register(create: ICreationRule): IGlobalContainerRegistration;
}

import { IContainerRegistration } from "rfluxx";
/**
 * The default container registration interface extend by several page awareness methods.
 */
export interface IGlobalContainerRegistration extends IContainerRegistration {
    /**
     * Share the instances created from this registration globally with all pages.
     * Only a single instance will be created in the whole app per instance name.
     */
    shareGlobally(): IGlobalContainerRegistration;
}

import { IContainerRegistration } from "rfluxx";
/**
 * The default container registration interface extend by several page awareness methods.
 */
export interface ISiteMapNodeContainerRegistration
{
    /**
     * Register the creation rule under the given key.
     * Duplicated from { @see IContainerRegistration } because of different return type
     * @param key The key to register the creation rule under.
     */
    as(key: string): ISiteMapNodeContainerRegistration;

    /**
     * Register the creation rule in the collection with the given key.
     * Duplicated from { @see IContainerRegistration } because of different return type
     * @param collectionKey The key of the collection to register the creation rule in.
     */
    in(collectionKey: string): ISiteMapNodeContainerRegistration;

    // /**
    //  * Share the instances created from this registration between all pages of this site map node.
    //  */
    // shareBetweenOwnPages(): ISiteMapNodeContainerRegistration;
    // /**
    //  * Share the instances created from this registration with all pages of the children site map nodes.
    //  * It also shares the instances between all of the pages of this site map node.
    //  */
    // shareToChildrenPages(): ISiteMapNodeContainerRegistration;
    // /**
    //  * Share the instances created from this registration with all pages who have the same parent
    //  * site map node.
    //  * It also shares the instances between all of the pages of this site map node.
    //  */
    // shareToSiblingPages(): ISiteMapNodeContainerRegistration;
    // /**
    //  * Share the instances created from this registration with all pages of the parent site map node.
    //  * It also shares the instances between all of the pages of this site map node.
    //  */
    // shareToParentPages(): ISiteMapNodeContainerRegistration;
    // /**
    //  * Share the instances created from this registration with all pages whose site map nodes are
    //  * somewhere below this site map node in the sitemap tree.
    //  * It also shares the instances between all of the pages of this site map node.
    //  */
    // shareToDescendantsPages(): ISiteMapNodeContainerRegistration;
    // /**
    //  * Share the instances created from this registration with all pages who have the same parent
    //  * site map node.
    //  * It also shares the instances between all of the pages of this site map node.
    //  */
    // shareToStranger(siteMapNodeId: string): ISiteMapNodeContainerRegistration;
}

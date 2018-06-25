import { ISiteNode, SiteNodeType } from './SiteMap';

export function findSiteMapNode(
    root: ISiteNode, 
    predicate: (siteNode: ISiteNode, parents: ISiteNode[]) => boolean,
    parents: ISiteNode[] = [],
    onlyCollectionNodes: boolean = false): ISiteNode 
{
    if(predicate(root, parents)) {
        return root;
    }

    if(onlyCollectionNodes === false || root.type === SiteNodeType.SiteNodeCollection) {
        const newParents = [...parents, root];

        if(root.subNodes) {
            for(let node of root.subNodes) {
                const foundNode = findSiteMapNode(node, predicate, newParents);
                if(foundNode) {
                    return foundNode;
                }
            }
        }
    }

    return null;
}

export function traverseSiteNodes(
    root: ISiteNode, 
    foreachNode: (ISiteNode, parents: ISiteNode[]) => void,
    parents: ISiteNode[] = [],
    onlyCollectionNodes: boolean = false) 
{
    foreachNode(root, parents);

    if(root.subNodes) {
        if(onlyCollectionNodes === false || root.type === SiteNodeType.SiteNodeCollection) {
            const newParents = [...parents, root];
            root.subNodes.forEach(x => traverseSiteNodes(x, foreachNode, newParents));
        }
    }
}
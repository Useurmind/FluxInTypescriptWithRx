import { ISiteMapNode } from "./ISiteMapNode";
/**
 * Execute an action for each site map node in the tree of nodes.
 * @param root The root node.
 * @param action An action to execute for each node.
 * @param path The path of site map nodes until before the current root node (excluding the root node).
 */
export function forEachSiteMapNode<T>(root: ISiteMapNode, action: (s: ISiteMapNode, sPath: ISiteMapNode[], parentValue?: T) => void | T, path: ISiteMapNode[] = [], parentValue?: T): void {
    const newPath = path.concat([root]);
    const rootValue = action(root, newPath, parentValue);
    if (root.children === undefined) {
        return;
    }
    for (const node of root.children) {
        forEachSiteMapNode(node, action, newPath, rootValue);
    }
}

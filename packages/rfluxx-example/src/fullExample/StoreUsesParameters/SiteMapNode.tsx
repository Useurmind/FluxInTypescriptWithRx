import * as React from "react";
import { ISiteMapNode } from "rfluxx-routing";

import { ContainerFactory } from "./ContainerFactory";
import { UseParametersPage } from "./UseParametersPage";


/**
 * The site map node for this page.
 */
export const siteMapNode: ISiteMapNode = 
{
    caption: "Use Parameters In Store",
    routeExpression: "store/uses/parameter/{value}",
    containerFactory: new ContainerFactory(),
    render: p => <UseParametersPage />
};

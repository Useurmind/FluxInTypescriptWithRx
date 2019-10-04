import * as React from "react";
import { ISiteMapNode } from "rfluxx-routing";

import { ContainerFactory } from "./ContainerFactory";
import { BoundPageBound } from "./BoundPage";


/**
 * The site map node for this page.
 */
export const siteMapNode: ISiteMapNode = 
{
    caption: "Bound page",
    routeExpression: "/boundPage",
    containerFactory: new ContainerFactory(),
    render: p => <BoundPageBound storeRegistrationKey="IBoundPageStore" />
};

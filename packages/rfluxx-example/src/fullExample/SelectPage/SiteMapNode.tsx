import * as React from "react";
import { ISiteMapNode } from "rfluxx-routing";

import { ContainerFactory } from "./ContainerFactory";
import { SelectPage } from "./SelectPage";


/**
 * The site map node for this page.
 */
export const siteMapNode: ISiteMapNode = 
{
    caption: p => <span style={{color : "red"}}>Select string</span>,
    routeExpression: "/select/page/",
    containerFactory: new ContainerFactory(),
    render: p => <SelectPage caption="Default"/>,
    showInSidebar: false
};

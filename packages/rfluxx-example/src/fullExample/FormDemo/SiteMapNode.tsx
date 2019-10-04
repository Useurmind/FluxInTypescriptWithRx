import * as React from "react";
import { ISiteMapNode } from "rfluxx-routing";

import { ContainerFactory } from "./ContainerFactory";
import { FormDemoPage } from "./FormDemoPage";


/**
 * The site map node for this page.
 */
export const siteMapNode: ISiteMapNode = 
{
    caption: "Form Demo",
    routeExpression: "form/demo/",
    containerFactory: new ContainerFactory(),
    render: p => <FormDemoPage />
};

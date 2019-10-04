import * as React from "react";
import { ISiteMapNode } from "rfluxx-routing";

import { MultiLanguagePage } from "./MultiLanguagePage";


/**
 * The site map node for this page.
 */
export const siteMapNode: ISiteMapNode = 
{
    caption: "Internationalization",
    routeExpression: "/internationalization",
    render: p => <MultiLanguagePage />
};

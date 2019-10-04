import * as React from "react";
import { ISiteMapNode } from "rfluxx-routing";

import { EndlessSequencePage } from "./EndlessSequencePage";


/**
 * The site map node for this page.
 */
export const siteMapNode: ISiteMapNode = 
{
    caption: "Endless sequence",
    routeExpression: "/endlessSequence/{sequenceNumber}/",
    render: p => <EndlessSequencePage />,
    showInSidebar: new Map([["sequenceNumber", "1"]])
};

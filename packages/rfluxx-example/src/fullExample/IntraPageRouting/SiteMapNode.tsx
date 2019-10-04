import * as React from "react";
import { ISiteMapNode } from "rfluxx-routing";

import { IntraRoutingPage } from "./IntraRoutingPage";


/**
 * The site map node for this page.
 */
export const siteMapNode: ISiteMapNode = 
{
    caption: p => <span>Intra page routing</span>,
    routeExpression: "/intraPageRouting?moreStuff={*}&moreDifferentStuff={*}",
    render: p => <IntraRoutingPage />,
    showInSidebar: new Map([["moreStuff", "false"], ["moreDifferentStuff", "false"]])
};

import * as React from "react";
import { ISiteMapNode } from "rfluxx-routing";

import { EditPage } from "./EditPage";
import { EditPageCaption } from "./EditPageCaption";


/**
 * The site map node for this page.
 */
export const siteMapNode: ISiteMapNode = 
{
    caption: p => <EditPageCaption />,
    routeExpression: "edit/page/",
    render: p => <EditPage />
};

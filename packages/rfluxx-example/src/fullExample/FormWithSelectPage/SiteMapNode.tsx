import * as React from "react";
import { ISiteMapNode } from "rfluxx-routing";

import { FormPage } from "./FormPage";


/**
 * The site map node for this page.
 */
export const siteMapNode: ISiteMapNode = 
{
    caption: p => <span>Form with select page</span>,
    routeExpression: "/form/with/select",
    render: p => <FormPage />
};

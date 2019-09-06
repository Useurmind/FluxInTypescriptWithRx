<% if (!includeTheming) { %>
import { createMuiTheme } from "@material-ui/core";
<% } %>
import * as React from "react";
import * as ReactDom from "react-dom";
import * as RfluxxRouting from "rfluxx-routing";
import { ISiteMapNode } from "rfluxx-routing";

import { App } from "./App";
import { HomePage } from "./HomePage";
import { GlobalContainerFactory } from "./GlobalContainerFactory";

const siteMap: ISiteMapNode = {
    caption: "Home",
    routeExpression: "home",
    render: p => <HomePage />
};

const globalContainerFactory = new GlobalContainerFactory();

const globalStores = RfluxxRouting.init({
    siteMap,
    containerFactory: globalContainerFactory,
    targetNumberOpenPages: 5,
    rootPath: ""
});

<% if (!includeTheming) { %>
const theme = createMuiTheme();
<% } %>

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(
        <App siteMapStore={globalStores.siteMapStore}
             pageManagementStore={globalStores.pageManagementStore}
             <% if (!includeTheming) { %>
             theme={theme} 
             <% } %>
             />,
        root);
});

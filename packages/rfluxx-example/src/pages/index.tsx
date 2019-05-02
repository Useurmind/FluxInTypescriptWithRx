import * as React from "react";
import * as ReactDom from "react-dom";

import * as RfluxxRouting from "rfluxx-routing";
import { ISiteMapNode } from "rfluxx-routing";
import { withPageContext } from "rfluxx-routing";

import { App } from "./App";
import { ContainerFactory } from "./ContainerFactory";
import { Counter } from "./Counter";

// use these variables to insert the corresponding shims through webpack
declare var es5;
declare var es6;
// tslint:disable-next-line:no-unused-expression
es5.nothing;
// tslint:disable-next-line:no-unused-expression
es6.nothing;

const siteMap: ISiteMapNode = {
    caption: "Home",
    routeExpression: "home",
    render: p => withPageContext(<Counter caption="Home Counter" />),
    children: [
        {
            caption: "Route 1",
            routeExpression: "route1",
            render: p => withPageContext(<Counter caption="Route 1 Counter" />)
        },
        {
            caption: "Route 2",
            routeExpression: "/area1/route2",
            render: p => withPageContext(<Counter caption="Route 2 Counter" />)
        },
        {
            caption: "Route 3",
            routeExpression: "/HOME/route3",
            render: p => withPageContext(<Counter caption="Route 3 Counter" />)
        }
    ]
};

const containerFactory = new ContainerFactory();

const globalStores = RfluxxRouting.init({
    siteMap,
    containerFactory
});

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(
        <App siteMapStore={globalStores.siteMapStore} pageManagementStore={globalStores.pageManagementStore} />,
        root);
});

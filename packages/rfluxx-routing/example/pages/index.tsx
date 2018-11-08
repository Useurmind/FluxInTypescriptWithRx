import * as React from "react";
import * as ReactDom from "react-dom";

import { withPageContext } from "../../src/PageContextProvider";
import { PageManagementStore } from "../../src/PageManagementStore";
import { configureRouterStore, RouterMode, routerStore } from "../../src/RouterStore";
import { getSiteMapRoutes, ISiteMapNode, SiteMapStore } from "../../src/SiteMapStore";

import { ContainerFactory } from "./ContainerFactory";
import { Counter } from "./Counter";
import { Page } from "./Page";

// use these variables to insert the corresponding shims through webpack
declare var es5;
declare var es6;
// tslint:disable-next-line:no-unused-expression
es5.nothing;
// tslint:disable-next-line:no-unused-expression
es6.nothing;

const siteMap: ISiteMapNode = {
    caption: "Home",
    route: {
        expression: "home"
    },
    render: p => withPageContext(<Counter caption="Home Counter" />),
    children: [
        {
            caption: "Route 1",
            route: {
                expression: "home/route1"
            },
            render: p => withPageContext(<Counter caption="Route 1 Counter" />)
        },
        {
            caption: "Route 2",
            route: {
                expression: "area1/route2"
            },
            render: p => withPageContext(<Counter caption="Route 2 Counter" />)
        },
        {
            caption: "Route 3",
            route: {
                expression: "HOME/route3"
            },
            render: p => withPageContext(<Counter caption="Route 3 Counter" />)
        }
    ]
};

const routes = getSiteMapRoutes(siteMap);

configureRouterStore({
    routes,
    mode: RouterMode.History
});

const siteMapStore = new SiteMapStore({
    routerStore,
    siteMap
});

const containerFactory = new ContainerFactory();

const pageManagementStore = new PageManagementStore({
    routerStore,
    siteMapStore,
    containerFactory
});

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(<Page siteMapStore={siteMapStore} pageManagementStore={pageManagementStore} />, root);
});

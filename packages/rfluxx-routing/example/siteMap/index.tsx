import * as React from "react";
import * as ReactDom from "react-dom";

import { configureRouterStore, RouterMode, routerStore } from "../../src/RouterStore";
import { getSiteMapRoutes, ISiteMapNode, SiteMapStore } from "../../src/SiteMapStore";

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
    render: p => <div>My home node</div>,
    children: [
        {
            caption: "Route 1",
            route: {
                expression: "home/route1"
            },
            render: p => <div>My route 1 node</div>
        },
        {
            caption: "Route 2",
            route: {
                expression: "area1/route2"
            },
            render: p => <div>My route 2 node</div>
        },
        {
            caption: "Route 3",
            route: {
                expression: "HOME/route3"
            },
            render: p => <div>My route 3 node</div>
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

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(<Page siteMapStore={siteMapStore} />, root);
});

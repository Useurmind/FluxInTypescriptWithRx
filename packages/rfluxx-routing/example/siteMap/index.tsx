import * as React from "react";
import * as ReactDom from "react-dom";

import { computeSiteMapRoutesAndSetAbsoluteRouteExpressions, ISiteMapNode, SiteMapStore } from "../../src";
import { ComplexRouteMatching } from "../../src/RouteMatching/ComplexRouteMatching";
import { RegexRouteMatching } from "../../src/RouteMatching/RegexRouteMatching";
import { configureRouterStore, RouterMode, RouterStore, routerStore } from "../../src/RouterStore";

import { App } from "./App";

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
    render: p => <div>My home node</div>,
    children: [
        {
            caption: "Route 1",
            routeExpression: "route1",
            render: p => <div>My route 1 node</div>
        },
        {
            caption: "Route 2",
            routeExpression: "/area1/route2",
            render: p => <div>My route 2 node</div>
        },
        {
            caption: "Route 3",
            routeExpression: "/HOME/route3",
            render: p => <div>My route 3 node</div>
        }
    ]
};

const routes = computeSiteMapRoutesAndSetAbsoluteRouteExpressions(siteMap);

console.info(routes);

configureRouterStore({
    routes,
    mode: RouterMode.History,
    routeMatchStrategy: new ComplexRouteMatching()
});

const siteMapStore = new SiteMapStore({
    routerStore,
    siteMap
});

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(<App siteMapStore={siteMapStore} />, root);
});

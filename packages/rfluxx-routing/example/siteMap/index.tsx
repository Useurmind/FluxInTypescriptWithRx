import * as React from "react";
import * as ReactDom from "react-dom";

import { routerStore, configureRouterStore, RouterMode } from "../../src/RouterStore";
import { Page } from "./Page";
import { ISiteMapNode, getSiteMapRoutes, SiteMapStore } from '../../src/SiteMapStore';

// use these variables to insert the corresponding shims through webpack
declare var es5;
declare var es6;
es5.nothing;
es6.nothing;

const siteMap: ISiteMapNode = {
    caption: "Home",
    route: {
        expression: "home"
    },
    children: [
        {
            caption: "Route 1",
            route: {
                expression: "home/route1"
            }
        },
        {
            caption: "Route 2",
            route: {
                expression: "area1/route2"
            }
        },
        {
            caption: "Route 3",
            route: {
                expression: "HOME/route3"
            }
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

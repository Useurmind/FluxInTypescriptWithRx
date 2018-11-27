import * as React from "react";
import * as ReactDom from "react-dom";

import { RegexRouteMatching } from "../../src/RouteMatching/RegexRouteMatching";
import {  configureRouterStore } from "../../src/RouterStore";

import { Page } from "./Page";

// use these variables to insert the corresponding shims through webpack
declare var es5;
declare var es6;
// tslint:disable-next-line:no-unused-expression
es5.nothing;
// tslint:disable-next-line:no-unused-expression
es6.nothing;

configureRouterStore({
    routes: [
        {
            expression: "route1"
        },
        {
            expression: "route2"
        },
        {
            expression: "sub/route3"
        }
    ],
    routeMatchStrategy: new RegexRouteMatching()
});

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(<Page />, root);
});

import * as React from "react";
import * as ReactDom from "react-dom";

import { routerStore, configureRouterStore } from "../../src/RouterStore";
import { Page } from "./Page";

// use these variables to insert the corresponding shims through webpack
declare var es5;
declare var es6;
es5.nothing;
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
    ]
})

document.addEventListener("DOMContentLoaded", function(event) {
    const root = document.getElementById("root");
    ReactDom.render(<Page />, root);
});

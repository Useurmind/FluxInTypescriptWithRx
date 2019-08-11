import * as React from "react";
import * as ReactDom from "react-dom";

import { Page } from "./Page";

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(<Page />, root);
});

declare const module: any;

if (module.hot)
{
    module.hot.accept("./Page", () =>
    {
        console.log("Accepting the updated Page module!");
    });
}

import * as React from "react";
import * as ReactDom from "react-dom";
import { Page } from "./Page";

// use these variables to insert the corresponding shims through webpack
declare var es5;
declare var es6;
es5.nothing;
es6.nothing;

document.addEventListener("DOMContentLoaded", function(event) {
    let root = document.getElementById("root");
    ReactDom.render(<Page />, root); 
});
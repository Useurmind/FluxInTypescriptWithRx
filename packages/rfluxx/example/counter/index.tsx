import * as React from "react";
import * as ReactDom from "react-dom";

import { Page } from "./Page";

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(<Page />, root);
});

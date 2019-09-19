import * as React from "react";
import * as ReactDom from "react-dom";
import { init as rfluxx_init } from "rfluxx";

import { CounterStore } from "./CounterStore";
import { Page } from "./Page";

const containerFactory = rfluxx_init()
    .useContainer(builder =>
    {
        builder.register(c => new CounterStore()).as("ICounterStore");
    })
    .useTimeTravel({
        registerInWindow: true
    });

document.addEventListener("DOMContentLoaded", event =>
{
    const root = document.getElementById("root");
    ReactDom.render(<Page containerFactory={containerFactory} />, root);
});

import * as React from "react";

import { AsyncAction } from "./AsyncAction";
import { explicitAsyncActionStore } from "./ExplicitAsyncActionStore";
import { implicitAsyncActionStore } from "./ImplicitAsyncActionStore";

export class Page extends React.Component<{}, {}> {

    constructor(props: any)
    {
        super(props);
    }

    public render(): any
    {
        return <div>
            <h1>Hello Async Action</h1>
            <AsyncAction  label="Implicit actions" store={implicitAsyncActionStore} />
            <AsyncAction  label="Explicit actions" store={explicitAsyncActionStore} />
        </div>;
    }
}
